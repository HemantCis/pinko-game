// plinkoHandlers.js

import membersModel from "../models/membersModel.js";
import PlinkoModel from "../models/plinkoModel.js";
import ExchangeModel from "../models/ExchangeModel.js";
import Decimal from "decimal.js";
import {
  getTopBet,
  getCreditedbalance,
  insertPromotionBonus,
  getBalance,
  getleaderBoradList,
  getDebitedbalance,
  calculateVIPLevel,
} from "../helper/userHelper.js";
import { Sequelize } from 'sequelize';

import { io } from "socket.io-client";
import dotenv from "dotenv";
dotenv.config();
const socket = io(process.env.BASE_URL);

// CONCURRENCY CONTROL: Track ongoing operations per member
const memberOperations = new Map();

// Helper function to acquire lock for member
const acquireMemberLock = async (memberId) => {
  if (memberOperations.has(memberId)) {
    throw new Error('Member operation in progress');
  }
  memberOperations.set(memberId, true);
  return () => {
    memberOperations.delete(memberId);
  };
};

export const registerPlinkoHandlers = async (payload) => {
  console.log("value come into that feature");
  const t = i18next.getFixedT(payload.lang);
  let transaction;
  let releaseLock;

  try {
    const { member_id, currency, betValue, clientSeed, dropValue, serverSeed, ticket } = payload;
    const balanceField = `user_${currency.toLowerCase()}_balance`;
    const exchField = `${currency.toLowerCase()}Price`;

    // ACQUIRE MEMBER LOCK for concurrency control
    try {
      releaseLock = await acquireMemberLock(member_id);
    } catch (error) {
      return socket.emit("plinko:bet_ack", { 
        status: 0, 
        message: t('operationInProgress') || 'Operation in progress, please wait...' 
      });
    }

    // Step 1: Get Member & Exchange Info with transaction for consistency
    transaction = await membersModel.sequelize.transaction();
    
    const member = await membersModel.findOne({ 
      where: { id: member_id }, 
      attributes: ["id", balanceField],
      lock: true,
      transaction
    });
    if (!member) {
      await transaction.rollback();
      releaseLock();
      return socket.emit("plinko:bet_ack", { status: 0, message: t('memberNotFound') });
    }

    const exchange = await ExchangeModel.findOne({ 
      attributes: [exchField], 
      limit: 1,
      transaction
    });
    if (!exchange || !exchange[exchField]) {
      await transaction.rollback();
      releaseLock();
      return socket.emit("plinko:bet_ack", { status: 0, message: t('exchangeRateNotFound') });
    }

    // Step 2: Balance Checks
    const userBalance = new Decimal(member[balanceField]);
    const betAmount = new Decimal(betValue);
    const exchangeRate = new Decimal(exchange[exchField]);
    const totalBalance = userBalance.times(exchangeRate);

    if (totalBalance.lessThan(betAmount)) {
      await transaction.rollback();
      releaseLock();
      return socket.emit("plinko:bet_ack", { status: 0, message: t('insufficientBalance') });
    }

    // Step 3: Calculate new balance and update database IMMEDIATELY
    const debited = await getDebitedbalance(userBalance, betAmount, exchangeRate);
    member[balanceField] = debited.updatedConvertedBalances;
    await member.save({ transaction });

    // Insert Plinko history within transaction
    await PlinkoModel.create({
      member_id,
      debit_amount: betAmount.toString(),
      clientSeed,
      dropValue,
      serverSeed,
      ticket,
      currency,
    }, { transaction });

    // Commit transaction
    await transaction.commit();
    
    // IMMEDIATE BALANCE SOCKET EMISSION (after successful DB update)
    const balanceData = {
      [balanceField]: debited.updatedConvertedBalances
    };
    
    socket.emit("getbalance", {
      data: balanceData,
      member_id: member.id,
    });

    // Step 4: Emit bet acknowledgement immediately
    socket.emit("plinko:bet_ack", { status: 1, message: t('betPlacedSuccessfully') });

    // Step 5: Handle background tasks
    setImmediate(async () => {
      try {
        // Apply bonuses / leaderboards
        await Promise.all([
          insertPromotionBonus(member.id),
          calculateVIPLevel(member.id),
        ]);

        const [topBets, leaderboard] = await Promise.all([
          getTopBet(),
          getleaderBoradList(),
        ]);

        socket.emit("getCasinoBet", { data: topBets });
        socket.emit("getLeaderBoard", { data: leaderboard });

      } catch (err) {
        console.error("Plinko background error for member", member_id, err);
      } finally {
        // Release lock after all operations complete
        releaseLock();
      }
    });

  } catch (e) {
    // Rollback transaction if any error occurs
    if (transaction) {
      await transaction.rollback();
    }
    // Release lock on error
    if (releaseLock) {
      releaseLock();
    }
    console.error("Error placing Plinko bet:", e);
    return socket.emit("plinko:bet_ack", {
      status: 0,
      message: t('anErrorOccurred'),
      data: e.message,
    });
  }
};




export const plinkoBetResultFun = async (payload) => {
  const t = i18next.getFixedT(payload.lang);
  let transaction;
  let releaseLock;

  try {
    const { member_id, clientSeed, winAmount, multiplier } = payload;

    // ACQUIRE MEMBER LOCK for concurrency control
    try {
      releaseLock = await acquireMemberLock(member_id);
    } catch (error) {
      return socket.emit("plinko:result", { 
        status: 0, 
        message: t('operationInProgress') || 'Operation in progress, please wait...' 
      });
    }

    // Step 1: Get data without transaction for speed
    const plinko = await PlinkoModel.findOne({ where: { clientSeed } });
    if (!plinko) {
      releaseLock();
      return socket.emit("plinko:result", { status: 0, message: t('plinkoGameNotFound') });
    }

    const currency = plinko.currency.toLowerCase();
    const balanceField = `user_${currency}_balance`;
    const exchField = `${currency}Price`;

    const member = await membersModel.findOne({
      where: { id: member_id },
      attributes: ["id", balanceField]
    });

    if (!member) {
      releaseLock();
      return socket.emit("plinko:result", { status: 0, message: t('memberNotFound') });
    }

    const exchange = await ExchangeModel.findOne({ 
      attributes: [exchField], 
      limit: 1
    });
    if (!exchange || !exchange[exchField]) {
      releaseLock();
      return socket.emit("plinko:result", { status: 0, message: t('exchangeRateNotFound') });
    }

    // IMMEDIATE BALANCE CALCULATION AND SOCKET EMISSION
    if (!isNaN(winAmount)) {
      const win = new Decimal(winAmount);
      const userBal = new Decimal(member[balanceField]);
      const credited = await getCreditedbalance(userBal, win, exchange[exchField]);
      
      // Emit balance immediately after calculation (before any DB operations)
      const balanceData = {
        [balanceField]: credited.updatedConvertedBalances
      };
      socket.emit("getbalance", { data: balanceData, member_id: member.id });
    }

    // Step 2: Handle database operations in background with transaction
    setImmediate(async () => {
      try {
        // Start database transaction for data integrity
        transaction = await membersModel.sequelize.transaction();

        // Get data with locks for update
        const plinkoForUpdate = await PlinkoModel.findOne({ 
          where: { clientSeed },
          lock: true,
          transaction 
        });

        if (!plinkoForUpdate) {
          await transaction.rollback();
          console.error("Plinko not found during transaction for clientSeed:", clientSeed);
          return;
        }

        const memberForUpdate = await membersModel.findOne({
          where: { id: member_id },
          attributes: ["id", balanceField],
          lock: true,
          transaction
        });

        if (!memberForUpdate) {
          await transaction.rollback();
          console.error("Member not found during transaction for member:", member_id);
          return;
        }

        // Update balance in database
        if (!isNaN(winAmount)) {
          const win = new Decimal(winAmount);
          const userBal = new Decimal(memberForUpdate[balanceField]);
          const credited = await getCreditedbalance(userBal, win, exchange[exchField]);
          memberForUpdate[balanceField] = credited.updatedConvertedBalances;
          await memberForUpdate.save({ transaction });
        }

        // Update plinko table
        plinkoForUpdate.credit_amount = new Decimal(winAmount || 0).toString();
        plinkoForUpdate.multiplier = new Decimal(multiplier || 0).toString();
        await plinkoForUpdate.save({ transaction });

        // Commit transaction
        await transaction.commit();
        console.log("Plinko table updated successfully for clientSeed:", clientSeed);

        // Step 3: Run heavy DB tasks after successful transaction
        const [topBets, leaderboard] = await Promise.all([
          getTopBet(),
          getleaderBoradList(),
        ]);

        socket.emit("getCasinoBet", { data: topBets });
        socket.emit("getLeaderBoard", { data: leaderboard });
        socket.emit("plinko:result", { status: 1, message: t('betResultProcessedSuccessfully') });

      } catch (err) {
        if (transaction) {
          await transaction.rollback();
        }
        console.error("Async error:", err);
      } finally {
        // Release lock after all operations complete
        releaseLock();
      }
    });

  } catch (e) {
    // Release lock on error
    if (releaseLock) {
      releaseLock();
    }
    console.error("Error processing result:", e);
    return socket.emit("plinko:result", { status: 0, message: t('anErrorOccurred'), data: e.message });
  }
};

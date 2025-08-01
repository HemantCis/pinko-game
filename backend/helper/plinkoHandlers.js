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

export const registerPlinkoHandlers = (socket) => {
  const translations = {
    en: {
      memberNotFound: "Member not found",
      exchangeRateNotFound: "Exchange rate not found",
      insufficientBalance: "Insufficient Balance",
      betPlacedSuccessfully: "Bet placed successfully",
      failedToPlaceBet: "Failed to place bet",
      anErrorOccurred: "An error occurred",
      plinkoGameNotFound: "Plinko game not found",
      betResultProcessedSuccessfully: "Bet result processed successfully",
    },
    ko: {
      memberNotFound: "회원을 찾을 수 없습니다",
      exchangeRateNotFound: "환율을 찾을 수 없습니다",
      insufficientBalance: "잔액 부족",
      betPlacedSuccessfully: "베팅 성공",
      failedToPlaceBet: "베팅 실패",
      anErrorOccurred: "오류가 발생했습니다",
      plinkoGameNotFound: "플링코 게임을 찾을 수 없습니다",
      betResultProcessedSuccessfully: "베팅 결과가 성공적으로 처리되었습니다",
    },
  };

  socket.on("plinko:place_bet", async (payload) => {
    const t = translations[payload.lang || "en"];

    try {
      const { member_id, currency, betValue, clientSeed, dropValue, serverSeed, ticket } = payload;
      const balanceField = `user_${currency.toLowerCase()}_balance`;
      const exchField = `${currency.toLowerCase()}Price`;

      let member = await membersModel.findOne({ where: { id: member_id }, attributes: ["id", balanceField] });
      if (!member) {
        return socket.emit("plinko:bet_ack", { status: 0, message: t.memberNotFound });
      }

      let exchange = await ExchangeModel.findOne({ attributes: [exchField], limit: 1 });
      if (!exchange || !exchange[exchField]) {
        return socket.emit("plinko:bet_ack", { status: 0, message: t.exchangeRateNotFound });
      }

      const userBalance = new Decimal(member[balanceField]);
      const betAmount = new Decimal(betValue);
      const exchangeRate = new Decimal(exchange[exchField]);
      const totalBalance = userBalance.times(exchangeRate);

      if (totalBalance.lessThan(betAmount)) {
        return socket.emit("plinko:bet_ack", { status: 0, message: t.insufficientBalance });
      }

      const plinko = await PlinkoModel.create({
        member_id,
        debit_amount: betAmount.toString(),
        clientSeed,
        dropValue,
        serverSeed,
        ticket,
        currency,
      });

      const debited = await getDebitedbalance(userBalance, betAmount, exchangeRate);
      member[balanceField] = debited.updatedConvertedBalances;
      await member.save();

      await insertPromotionBonus(member.id);
      await calculateVIPLevel(member.id);

      const [userBalanceData, topBets, leaderboard] = await Promise.all([
        getBalance(member.id),
        getTopBet(),
        getleaderBoradList(),
      ]);

      socket.emit("getbalance", { data: userBalanceData, member_id: member.id, old_balance: userBalance.toFixed(8) });
      socket.emit("getCasinoBet", { data: topBets });
      socket.emit("getLeaderBoard", { data: leaderboard });

      return socket.emit("plinko:bet_ack", { status: 1, message: t.betPlacedSuccessfully });
    } catch (e) {
      console.error("Error placing bet:", e);
      return socket.emit("plinko:bet_ack", { status: 0, message: t.anErrorOccurred, data: e.message });
    }
  });

  socket.on("plinko:bet_result", async (payload) => {
    const t = translations[payload.lang || "en"];
    try {
      const { member_id, clientSeed, winAmount, multiplier } = payload;

      const plinko = await PlinkoModel.findOne({ where: { clientSeed } });
      if (!plinko) {
        return socket.emit("plinko:result", { status: 0, message: t.plinkoGameNotFound });
      }

      plinko.credit_amount = new Decimal(winAmount || 0).toString();
      plinko.multiplier = new Decimal(multiplier || 0).toString();
      await plinko.save();

      const currency = plinko.currency.toLowerCase();
      const balanceField = `user_${currency}_balance`;
      const exchField = `${currency}Price`;

      const member = await membersModel.findOne({ where: { id: member_id }, attributes: ["id", balanceField] });
      if (!member) {
        return socket.emit("plinko:result", { status: 0, message: t.memberNotFound });
      }

      const exchange = await ExchangeModel.findOne({ attributes: [exchField], limit: 1 });
      if (!exchange || !exchange[exchField]) {
        return socket.emit("plinko:result", { status: 0, message: t.exchangeRateNotFound });
      }

      if (!isNaN(winAmount)) {
        const win = new Decimal(winAmount);
        const userBal = new Decimal(member[balanceField]);
        const credited = await getCreditedbalance(userBal, win, exchange[exchField]);
        member[balanceField] = credited.updatedConvertedBalances;
        await member.save();
      }

      const [userBalanceData, topBets, leaderboard] = await Promise.all([
        getBalance(member.id),
        getTopBet(),
        getleaderBoradList(),
      ]);

      socket.emit("getbalance", { data: userBalanceData, member_id: member.id });
      socket.emit("getCasinoBet", { data: topBets });
      socket.emit("getLeaderBoard", { data: leaderboard });

      return socket.emit("plinko:result", { status: 1, message: t.betResultProcessedSuccessfully });
    } catch (e) {
      console.error("Error processing result:", e);
      return socket.emit("plinko:result", { status: 0, message: t.anErrorOccurred, data: e.message });
    }
  });
};

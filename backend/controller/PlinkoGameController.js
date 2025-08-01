import Model from "../models/models.js";
import { io } from "socket.io-client";
import dotenv from "dotenv";
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
dotenv.config();
import dbCon from "../config/dbCon.js";

const socket = io(process.env.BASE_URL);

class PlinkoGameController extends Model {
  // API for place bet
  static insertPlinkoBet = async (req, res, next) => {
    const translations = {
      en: {
        memberNotFound: "Member not found",
        exchangeRateNotFound: "Exchange rate not found",
        insufficientBalance: "Insufficient Balance",
        betPlacedSuccessfully: "Bet placed successfully",
        failedToPlaceBet: "Failed to place bet",
        anErrorOccurred: "An error occurred",
      },
      ko: {
        memberNotFound: "회원을 찾을 수 없습니다",
        exchangeRateNotFound: "환율을 찾을 수 없습니다",
        insufficientBalance: "잔액 부족",
        betPlacedSuccessfully: "베팅 성공",
        failedToPlaceBet: "베팅 실패",
        anErrorOccurred: "오류가 발생했습니다",
      },
    };
    const lang = req.query.lang || "en";
    const t = translations[lang];
    try {
      const currency = req.body.currency.toLowerCase();
      const balanceField = `user_${currency}_balance`;

      // Fetch member data
      let member_obj = await membersModel.findOne({
        where: { id: req.member_id },
        attributes: ["id", balanceField],
      });

      if (!member_obj) {
        return res.status(404).json({ status: 0, message: t.memberNotFound });
      }

      // Fetch exchange rate
      const exchField = `${currency}Price`;
      let get_exch = await ExchangeModel.findOne({
        attributes: [exchField],
        limit: 1,
      });

      if (!get_exch || !get_exch[exchField]) {
        return res
          .status(404)
          .json({ status: 0, message: t.exchangeRateNotFound });
      }

      // Convert balances using Decimal
      let user_balance = new Decimal(member_obj[balanceField]);
      const betValue = new Decimal(req.body.betValue);
      const exchangeRate = new Decimal(get_exch[exchField]);

      let total_bal = user_balance.times(exchangeRate);
      if (total_bal.lessThan(betValue)) {
        return res.status(200).json({
          status: 0,
          message: t.insufficientBalance,
        });
      }

      // Create plinko bet record
      let plinko_obj = await PlinkoModel.create({
        member_id: req.member_id,
        debit_amount: betValue.toString(),
        clientSeed: req.body.clientSeed,
        dropValue: req.body.dropValue,
        serverSeed: req.body.serverSeed,
        ticket: req.body.ticket,
        currency: currency,
      });

      if (plinko_obj) {
        let debit_balance_obj = await getDebitedbalance(
          user_balance,
          betValue,
          get_exch[exchField]
        );
        // Update remaining balance
        console.log("debit_balance_obj>>>>", debit_balance_obj);

        // let new_remain_bal = user_balance.minus(betValue);
        member_obj[balanceField] = debit_balance_obj.updatedConvertedBalances;
        await member_obj.save();

        // Additional operations
        await insertPromotionBonus(member_obj.id);
        let all_bet_obj = await getTopBet();
        await calculateVIPLevel(member_obj.id);
        let userBalance = await getBalance(member_obj.id);
        let leader_board_list = await getleaderBoradList();

        // Emit socket events
        socket.emit("getbalance", {
          data: userBalance,
          member_id: member_obj.id,
          old_balance: user_balance.toFixed(8),
        });
        socket.emit("getCasinoBet", { data: all_bet_obj });
        socket.emit("getLeaderBoard", { data: leader_board_list });

        return res.status(200).json({
          status: 1,
          message: t.betPlacedSuccessfully,
        });
      } else {
        return res.status(200).json({
          status: 0,
          message: t.failedToPlaceBet,
        });
      }
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).json({
        status: 0,
        message: t.anErrorOccurred,
        data: e.message,
      });
    }
  };

  // API for insert win amount
  static betResultPlinko = async (req, res, next) => {
    console.log("result of plinko game", req.body);
    const translations = {
      en: {
        plinkoGameNotFound: "Plinko game not found",
        memberNotFound: "Member not found",
        exchangeRateNotFound: "Exchange rate not found",
        betResultProcessedSuccessfully: "Bet result processed successfully",
        anErrorOccurred: "An error occurred",
      },
      ko: {
        plinkoGameNotFound: "플링코 게임을 찾을 수 없습니다",
        memberNotFound: "회원을 찾을 수 없습니다",
        exchangeRateNotFound: "환율을 찾을 수 없습니다",
        betResultProcessedSuccessfully: "베팅 결과가 성공적으로 처리되었습니다",
        anErrorOccurred: "오류가 발생했습니다",
      },
    };
    const lang = req.query.lang || "en";
    const t = translations[lang];
    try {
      // Fetch Plinko game data
      let plinko_obj = await PlinkoModel.findOne({
        where: { clientSeed: req.body.clientSeed },
      });

      if (!plinko_obj) {
        return res.status(404).json({
          status: 0,
          message: t.plinkoGameNotFound,
        });
      }

      // Update Plinko game results
      plinko_obj.credit_amount = new Decimal(
        req.body.winAmount || 0
      ).toString();
      plinko_obj.multiplier = new Decimal(req.body.multiplier || 0).toString();
      await plinko_obj.save();

      const currency = plinko_obj.currency.toLowerCase();
      const balanceField = `user_${currency}_balance`;

      // Fetch member data
      let member_obj = await membersModel.findOne({
        where: { id: req.member_id },
        attributes: ["id", balanceField],
      });

      if (!member_obj) {
        return res.status(404).json({
          status: 0,
          message: t.memberNotFound,
        });
      }

      // Fetch exchange rate
      const exchField = `${currency}Price`;
      let get_exch = await ExchangeModel.findOne({
        attributes: [exchField],
        limit: 1,
      });

      if (!get_exch || !get_exch[exchField]) {
        return res.status(404).json({
          status: 0,
          message: t.exchangeRateNotFound,
        });
      }

      // Update user balance if winAmount is valid
      if (!isNaN(req.body.winAmount)) {
        const winAmount = new Decimal(req.body.winAmount);
        const user_balance = new Decimal(member_obj[balanceField]);
        console.log("winAmount>>>>plinko>>>>", winAmount);
        console.log("user_balance>>>>plinko>>>>", user_balance);
        let credit_balance_obj = await getCreditedbalance(
          user_balance,
          winAmount,
          get_exch[exchField]
        );
        console.log("credit_balance_obj>>>>>", credit_balance_obj);
        member_obj[balanceField] = credit_balance_obj.updatedConvertedBalances;
        await member_obj.save();
      }

      // Fetch additional data for socket events
      let all_bet_obj = await getTopBet();
      let userBalance = await getBalance(member_obj.id);
      let leader_board_list = await getleaderBoradList();

      // Emit socket events
      socket.emit("getbalance", {
        data: userBalance,
        member_id: member_obj.id,
      });
      socket.emit("getCasinoBet", {
        data: all_bet_obj,
      });
      socket.emit("getLeaderBoard", {
        data: leader_board_list,
      });

      return res.status(200).json({
        status: 1,
        message: t.betResultProcessedSuccessfully,
      });
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).json({
        status: 0,
        message: t.anErrorOccurred,
        data: e.message,
      });
    }
  };
}

export default PlinkoGameController;

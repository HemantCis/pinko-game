import dbCon from "../config/dbCon.js";
import ExchangeModel from "../models/ExchangeModel.js";
import membersModel from "../models/membersModel.js";
import CasinoHistoryModel from "../models/CasinoHistoryModel.js";
import SportPlacedHistoryModel from "../models/SportPlacedHistoryModel.js";
import PromotionModel from "../models/PromotionModel.js";
import AssignTicketModel from "../models/AssignTicketModel.js";
import PlinkoModel from "../models/plinkoModel.js";
import VipBonusMemberModel from "../models/VipBonusMemberModel.js";
import NotificationTblModel from "../models/NotificationTblModel.js";
import moment from "moment";
import Decimal from "decimal.js";
import dotenv from "dotenv";
import axios from "axios";
import { io } from "socket.io-client";
import { Op, fn, col, where, Sequelize } from "sequelize";
const socket = io(process.env.BASE_URL);

// export const getUsernameById = async (userId) => {
export async function getTopBet() {
  console.log("getTopBEt");
  // LEFT JOIN plinko_histories AS ph ON ph.member_id = m.id
  const query = `SELECT ch.debit_amount, ch.credit_amount, ch.created_at, m.username, m.ghost_mode, m.community_ghost_mode, m.hide_statistics, m.hide_race_statistics, cgl.name as game_name FROM casino_histories AS ch LEFT JOIN members AS m ON ch.member_id = m.id LEFT JOIN casino_game_lists AS cgl ON cgl.id_hash = ch.id_hash ORDER BY ch.created_at DESC LIMIT 10`;
  console.log("query = ", query);
  const [bet_obj, metadata] = await dbCon.query(query);

  const queryp = `SELECT ph.debit_amount, ph.credit_amount, ph.created_at, m.username, m.ghost_mode, m.community_ghost_mode, m.hide_statistics, m.hide_race_statistics FROM plinko_histories AS ph LEFT JOIN members AS m ON ph.member_id = m.id ORDER BY ph.created_at DESC LIMIT 10`;
  console.log("queryp = ", queryp);
  const [plinko_bet_obj, metadata2] = await dbCon.query(queryp);
  const updatedPlinkoBetObj = plinko_bet_obj.map((obj) => ({
    ...obj,
    game_name: "Plinko",
  }));

  const combinedArray = [...bet_obj, ...updatedPlinkoBetObj];

  // Sort the combined array by date in descending order
  const sortedArray = combinedArray.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });
  const final_bet_obj = sortedArray.slice(0, 10);

  if (final_bet_obj) {
    return final_bet_obj;
  } else {
    return false;
  }
}

export async function getUpdatedbalance(
  balances,
  user_btc_balance,
  user_eth_balance,
  user_usdt_balance,
  user_bnb_balance = 0,
  user_sol_balance = 0,
  user_usdc_balance = 0,
  user_trx_balance = 0
) {
  console.log("getUpdatedbalance");
  let get_exch = await ExchangeModel.findOne({
    order: [["id", "DESC"]],
    limit: 1,
  });

  const currencies = [
    { name: "btc", balance: user_btc_balance, price: get_exch.btcPrice },
    { name: "eth", balance: user_eth_balance, price: get_exch.ethPrice },
    { name: "usdt", balance: user_usdt_balance, price: get_exch.usdtPrice },
    { name: "bnb", balance: user_bnb_balance, price: get_exch.bnbPrice },
    { name: "sol", balance: user_sol_balance, price: get_exch.solPrice },
    { name: "usdc", balance: user_usdc_balance, price: get_exch.usdcPrice },
    { name: "trx", balance: user_trx_balance, price: get_exch.trxPrice },
  ];

  const updatedBalances = {};

  for (let i = 0; i < currencies.length; i++) {
    const currency = currencies[i];
    const updatedBalanceName = `updated_${currency.name}`;

    if (currency.balance > 0) {
      const currencyBalanceValue = currency.price * currency.balance;

      if (balances < currencyBalanceValue) {
        updatedBalances[updatedBalanceName] = balances / currency.price;
        balances = 0; // Since the remaining balance has been exhausted
        break; // Exit the loop as no balance remains
      } else {
        updatedBalances[updatedBalanceName] = currency.balance;
        balances -= currencyBalanceValue;
      }
    } else {
      updatedBalances[updatedBalanceName] = 0;
    }
  }

  // Set remaining currencies to 0 if balance is exhausted
  for (let i = 0; i < currencies.length; i++) {
    const currency = currencies[i];
    const updatedBalanceName = `updated_${currency.name}`;
    if (!updatedBalances.hasOwnProperty(updatedBalanceName)) {
      updatedBalances[updatedBalanceName] = 0;
    }
  }

  return updatedBalances;
}

export async function getDebitedbalance(user_balance, bet_amount, exchRate) {
  console.log("getDebitedbalance");
  // Convert inputs to Decimal instances
  const userBalanceDecimal = new Decimal(user_balance);
  const betAmountDecimal = new Decimal(bet_amount);
  const exchRateDecimal = new Decimal(exchRate);

  console.log("debit userBalanceDecimal>>>>>>", userBalanceDecimal);
  console.log("debit betAmountDecimal>>>>>>", betAmountDecimal);
  console.log("debit exchRateDecimal>>>>>>", exchRateDecimal);

  // Perform calculations
  const deductMoney = betAmountDecimal.div(exchRateDecimal);
  console.log("debit deductMoney>>>>>>", deductMoney);
  const updatedConvertedBalances = userBalanceDecimal.minus(deductMoney);

  const updatedBalances = updatedConvertedBalances.times(exchRateDecimal);
  console.log(
    "after minus previous balance in crypto>>>>>>",
    updatedConvertedBalances
  );
  console.log("after minus previous balance in real>>>>>>", updatedBalances);
  // Return the result
  return {
    updatedBalances: new Decimal(updatedBalances.toFixed(8)),
    updatedConvertedBalances: new Decimal(updatedConvertedBalances.toFixed(8)),
  };

  // return updatedConvertedBalances;
}

export async function getCreditedbalance(user_balance, bet_amount, exchRate) {
  console.log("getCreditedbalance");

  // Convert inputs to Decimal instances
  const userBalanceDecimal = new Decimal(user_balance);
  const betAmountDecimal = new Decimal(bet_amount);
  const exchRateDecimal = new Decimal(exchRate);

  // Perform calculations
  const deductMoney = betAmountDecimal.div(exchRateDecimal);
  console.log("credit deductMoney>>>>>>", deductMoney);
  const updatedConvertedBalances = userBalanceDecimal.plus(deductMoney);
  const updatedBalances = updatedConvertedBalances.times(exchRateDecimal);

  // Return the result
  return {
    updatedBalances: new Decimal(updatedBalances.toFixed(8)),
    updatedConvertedBalances: new Decimal(updatedConvertedBalances.toFixed(8)),
  };

  // return updatedConvertedBalances;
}

// export async function insertPromotionBonus(member_id) {
//   console.log("insertPromotionBonus>>>>>>>>>>", member_id);
//   try {
//     // Calculate the sum of debit amounts for casino, plinko and sports within the time range
//     let plinko_obj = await PlinkoModel.sum("debit_amount", {
//       where: {
//         member_id: member_id,
//         created_at: {
//           [Op.between]: [
//             moment().tz("Asia/Seoul").startOf("day").toDate(),
//             moment().tz("Asia/Seoul").endOf("day").toDate(),
//           ],
//         },
//       },
//     });
//     let casino_obj = await CasinoHistoryModel.sum("debit_amount", {
//       where: {
//         member_id: member_id,
//         created_at: {
//           [Op.between]: [
//             moment().tz("Asia/Seoul").startOf("day").toDate(),
//             moment().tz("Asia/Seoul").endOf("day").toDate(),
//           ],
//         },
//       },
//     });

//     let sports_obj = await SportPlacedHistoryModel.sum("debit_amount", {
//       where: {
//         member_id: member_id,
//         created_at: {
//           [Op.between]: [
//             moment().tz("Asia/Seoul").startOf("day").toDate(),
//             moment().tz("Asia/Seoul").endOf("day").toDate(),
//           ],
//         },
//       },
//     });

//     // Find the promotion object with the specified criteria
//     let promotion_obj = await PromotionModel.findOne({
//       where: {
//         bonus_type: "other",
//         ticket: {
//           [Op.not]: null,
//         },
//       },
//     });

//     if (promotion_obj) {
//       console.log(
//         "sum of all three game debit amount >>>>> ",
//         casino_obj,
//         sports_obj,
//         plinko_obj
//       );
//       const total_amount =
//         (plinko_obj || 0) + (casino_obj || 0) + (sports_obj || 0);
//       console.log("total_amount>>>>>>>>>>", total_amount);
//       console.log("promotion_obj.min_price>>>>>>>>>>", promotion_obj.min_price);

//       // Check if the total amount is greater than or equal to the minimum price for the promotion
//       if (total_amount >= promotion_obj.min_price) {
//         console.log("Eligible for promotion");

//         const ticket_arr = JSON.parse(promotion_obj.ticket);
//         let multiplier = Math.floor(total_amount / promotion_obj.min_price);
//         console.log("multiplier>>>>>>>>>>", multiplier);
//         let i = 0;

//         for (const item of ticket_arr) {
//           let startDate, endDate;

//           if (moment().tz("Asia/Seoul").isoWeekday() === 6) {
//             startDate = moment().tz("Asia/Seoul").startOf("day");
//             endDate = moment()
//               .tz("Asia/Seoul")
//               .add(1, "week")
//               .isoWeekday(6)
//               .endOf("day");
//           } else {
//             startDate = moment()
//               .tz("Asia/Seoul")
//               .subtract(1, "week")
//               .isoWeekday(6)
//               .startOf("day");
//             endDate = moment().tz("Asia/Seoul").isoWeekday(6).endOf("day");
//           }

//           let assignTicket_obj = await AssignTicketModel.findOne({
//             where: {
//               ticket: item,
//               created_at: {
//                 [Op.between]: [startDate.toDate(), endDate.toDate()],
//               },
//             },
//           });

//           // If no ticket is found, create one
//           if (!assignTicket_obj) {
//             console.log("Assigning promotion ticket:", item);
//             await AssignTicketModel.create({
//               promotion_id: promotion_obj.id,
//               ticket: item,
//               member_id: member_id,
//             });
//             i++;
//           } else {
//             console.log("Ticket already assigned");
//             if (assignTicket_obj.member_id === member_id) {
//               multiplier--;
//             }
//           }

//           // Break the loop if the required number of tickets have been assigned
//           if (i === multiplier) {
//             return true;
//           }
//         }
//       }
//     }

//     return false;
//   } catch (error) {
//     console.error("Error in insertPromotionBonus:", error);
//     throw error;
//   }
// }

export async function insertPromotionBonus(member_id) {
  console.log("insertPromotionBonus>>>>>>>>>>", member_id);
  try {
    // Calculate the sum of debit amounts for casino, plinko, and sports within the time range
    let plinko_obj = await PlinkoModel.sum("debit_amount", {
      where: {
        member_id: member_id,
        created_at: {
          [Op.between]: [
            moment().tz("Asia/Seoul").startOf("day").toDate(),
            moment().tz("Asia/Seoul").endOf("day").toDate(),
          ],
        },
      },
    });

    let casino_obj = await CasinoHistoryModel.sum("debit_amount", {
      where: {
        member_id: member_id,
        created_at: {
          [Op.between]: [
            moment().tz("Asia/Seoul").startOf("day").toDate(),
            moment().tz("Asia/Seoul").endOf("day").toDate(),
          ],
        },
      },
    });

    let sports_obj = await SportPlacedHistoryModel.sum("debit_amount", {
      where: {
        member_id: member_id,
        created_at: {
          [Op.between]: [
            moment().tz("Asia/Seoul").startOf("day").toDate(),
            moment().tz("Asia/Seoul").endOf("day").toDate(),
          ],
        },
      },
    });

    // Find the promotion object with the specified criteria
    let promotion_obj = await PromotionModel.findOne({
      where: {
        bonus_type: "other",
        ticket: {
          [Op.not]: null,
        },
      },
    });

    if (promotion_obj) {
      console.log(
        "sum of all three game debit amounts >>>>> ",
        casino_obj,
        sports_obj,
        plinko_obj
      );

      const total_amount =
        (plinko_obj || 0) + (casino_obj || 0) + (sports_obj || 0);
      console.log("total_amount>>>>>>>>>>", total_amount);
      console.log("promotion_obj.min_price>>>>>>>>>>", promotion_obj.min_price);

      // Check if the total amount is greater than or equal to the minimum price for the promotion
      if (total_amount >= promotion_obj.min_price) {
        console.log("Eligible for promotion");

        // Ensure promotion_obj.ticket is a valid array
        let ticket_arr = [];
        try {
          ticket_arr = promotion_obj.ticket
            ? JSON.parse(promotion_obj.ticket)
            : [];
        } catch (e) {
          console.error("Error parsing ticket:", e);
        }

        let multiplier = Math.floor(total_amount / promotion_obj.min_price);
        console.log("multiplier>>>>>>>>>>", multiplier);
        let i = 0;
        let assigned_tickets = [];

        for (const item of ticket_arr) {
          let startDate, endDate;

          if (moment().tz("Asia/Seoul").isoWeekday() === 6) {
            startDate = moment().tz("Asia/Seoul").startOf("day");
            endDate = moment()
              .tz("Asia/Seoul")
              .add(1, "week")
              .isoWeekday(6)
              .endOf("day");
          } else {
            startDate = moment()
              .tz("Asia/Seoul")
              .subtract(1, "week")
              .isoWeekday(6)
              .startOf("day");
            endDate = moment().tz("Asia/Seoul").isoWeekday(6).endOf("day");
          }

          let assignTicket_obj = await AssignTicketModel.findOne({
            where: {
              ticket: item,
              created_at: {
                [Op.between]: [startDate.toDate(), endDate.toDate()],
              },
            },
          });

          // If no ticket is found, assign it
          if (!assignTicket_obj) {
            console.log("Assigning promotion ticket:", item);
            await AssignTicketModel.create({
              promotion_id: promotion_obj.id,
              ticket: item,
              member_id: member_id,
            });
            assigned_tickets.push(item);
            i++;
          } else {
            console.log("Ticket already assigned");
            if (assignTicket_obj.member_id === member_id) {
              multiplier--;
            }
          }

          // Break the loop if required tickets are assigned
          if (i === multiplier) {
            return true;
          }
        }

        // If all existing tickets are assigned, generate new unique tickets
        while (i < multiplier) {
          const new_ticket = await generateUniqueTicket(); // Fix: Await the function call
          console.log("Generating new ticket:", new_ticket);

          // Save the new ticket in AssignTicketModel
          await AssignTicketModel.create({
            promotion_id: promotion_obj.id,
            ticket: new_ticket,
            member_id: member_id,
          });

          // Update the promotion object with the new ticket
          ticket_arr.push(new_ticket);
          assigned_tickets.push(new_ticket);

          i++;
        }

        // Update the promotion_obj.ticket field with the new ticket list
        await PromotionModel.update(
          { ticket: JSON.stringify(ticket_arr) }, // Fix: Ensure it's a string
          { where: { id: promotion_obj.id } }
        );

        console.log("Updated ticket list in PromotionModel:", ticket_arr);
      }
    }

    return false;
  } catch (error) {
    console.error("Error in insertPromotionBonus:", error);
    throw error;
  }
}

// Function to generate a random ticket ID
const generateUniqueTicket = async () => {
  let newTicket;
  let ticketExists = true;

  do {
    newTicket = Math.floor(1000 + Math.random() * 9000);
    const existingTicket = await PromotionModel.findOne({
      where: {
        bonus_type: "other",
        ticket: newTicket,
      },
    });

    ticketExists = existingTicket !== null;
  } while (ticketExists);

  return newTicket;
};

export async function getBalance(member_id) {
  console.log("getBalnce", member_id);
  let member_obj = await membersModel.findOne({
    where: {
      id: member_id,
    },
    attributes: [
      "id",
      "user_balance",
      "user_btc_balance",
      "user_eth_balance",
      "user_usdt_balance",
      "user_bnb_balance",
      "user_sol_balance",
      "user_usdc_balance",
      "user_trx_balance",
      "user_xrp_balance",
      "user_doge_balance",
      "user_shib_balance",
      "user_ton_balance",
      "vip_level",
    ],
  });

  if (member_obj) {
    return member_obj;
  } else {
    return false;
  }
}

export async function getleaderBoradList() {
  try {
    console.log("get leaderboard list");
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

    const query = `SELECT combined.id, combined.username, 
    SUM(combined.total_debit_amount) AS total_debit_amount, 
    SUM(combined.total_sports_debit_amount) AS total_sports_debit_amount,
    SUM(combined.total_casino_debit_amount) AS total_casino_debit_amount,
    SUM(combined.total_plinko_debit_amount) AS total_plinko_debit_amount
FROM (
    -- Sports debit amount
    SELECT m.id, m.username, SUM(sbh.debit_amount) AS total_sports_debit_amount, 
           0 AS total_casino_debit_amount, 0 AS total_plinko_debit_amount, 
           SUM(sbh.debit_amount) AS total_debit_amount
    FROM members AS m 
    INNER JOIN sport_placed_histories AS sbh ON m.id = sbh.member_id 
    WHERE DATE(sbh.created_at) = '${today}' 
    GROUP BY m.id, m.username 

    UNION ALL

    -- Casino debit amount
    SELECT m.id, m.username, 0 AS total_sports_debit_amount, 
           SUM(ch.debit_amount) AS total_casino_debit_amount, 0 AS total_plinko_debit_amount, 
           SUM(ch.debit_amount) AS total_debit_amount
    FROM members AS m 
    INNER JOIN casino_histories AS ch ON m.id = ch.member_id 
    WHERE DATE(ch.created_at) = '${today}' 
    GROUP BY m.id, m.username 

    UNION ALL

    -- Plinko debit amount
    SELECT m.id, m.username, 0 AS total_sports_debit_amount, 
           0 AS total_casino_debit_amount, SUM(ph.debit_amount) AS total_plinko_debit_amount, 
           SUM(ph.debit_amount) AS total_debit_amount
    FROM members AS m 
    INNER JOIN plinko_histories AS ph ON m.id = ph.member_id 
    WHERE DATE(ph.created_at) = '${today}' 
    GROUP BY m.id, m.username
) AS combined 
GROUP BY combined.id, combined.username 
ORDER BY total_debit_amount DESC 
LIMIT 10;
`;
    const [leader_obj, metadata] = await dbCon.query(query);
    if (leader_obj.length > 0) {
      return leader_obj;
    } else {
      return leader_obj;
    }
  } catch (err) {
    return res.status(200).json({
      status: 0,
      message: "문제가 발생했습니다.",
      data: err,
    });
  }
}

export async function calculateVIPLevel(member_id) {
  try {
    const grandTotal = await getTotalbet(member_id);
    console.log("grandTotal>>>", grandTotal);
    if (!grandTotal) return;
    const vipLevels = [
      {
        level: "Bronze",
        threshold: 10000,
        bonus: 15,
        title: "VIP 업적",
        message:
          "브론즈 VIP 되신것을 축하드립니다 레벨업 보너스가 지급되었습니다 🥉",
      },
      {
        level: "Silver",
        threshold: 50000,
        bonus: 50,
        title: "VIP 업적",
        message:
          "실버 VIP 되신것을 축하드립니다 레벨업 보너스가 지급되었습니다 🥈",
      },
      {
        level: "Gold",
        threshold: 100000,
        bonus: 100,
        title: "VIP 업적",
        message:
          "골드 VIP 되신것을 축하드립니다 레벨업 보너스가 지급되었습니다 🏅",
      },
      {
        level: "Platinum",
        threshold: 10000000,
        bonus: 0,
        title:
          "플래티넘 VIP 되신것을 축하드립니다 새로운 혜택 안내를 위해 VIP 매니저가 곧 연락을 드릴 예정입니다 🔥",
        message:
          "플래티넘 VIP 되신것을 축하드립니다 새로운 혜택 안내를 위해 VIP 매니저가 곧 연락을 드릴 예정입니다 🔥",
      },
      {
        level: "Emerald",
        threshold: 50000000,
        bonus: 0,
        title:
          "에매랄드 VIP 되신것을 축하드립니다 새로운 혜택 안내를 위해 VIP 매니저가 곧 연락을 드릴 예정입니다 🔥",
        message:
          "에매랄드 VIP 되신것을 축하드립니다 새로운 혜택 안내를 위해 VIP 매니저가 곧 연락을 드릴 예정입니다 🔥",
      },
      {
        level: "Diamond",
        threshold: 150000000,
        bonus: 0,
        title:
          "다이아몬드 VIP 되신것을 축하드립니다 새로운 혜택 안내를 위해 VIP 매니저가 곧 연락을 드릴 예정입니다 💎",
        message:
          "다이아몬드 VIP 되신것을 축하드립니다 새로운 혜택 안내를 위해 VIP 매니저가 곧 연락을 드릴 예정입니다 💎",
      },
      {
        level: "Obsidian",
        threshold: 500000000,
        bonus: 0,
        title:
          "옵시디언 VIP 되신것을 축하드립니다 새로운 혜택 안내를 위해 VIP 매니저가 곧 연락을 드릴 예정입니다 🔮",
        message:
          "옵시디언 VIP 되신것을 축하드립니다 새로운 혜택 안내를 위해 VIP 매니저가 곧 연락을 드릴 예정입니다 🔮",
      },
    ];

    // Current date and expiration time
    const currentDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
    const expirationDate = moment()
      .tz("Asia/Seoul")
      .add(48, "hours")
      .format("YYYY-MM-DD HH:mm:ss");

    // Iterate through VIP levels
    for (const vip of vipLevels) {
      if (grandTotal >= vip.threshold) {
        // Check if the member already has this VIP level
        const vipExists = await VipBonusMemberModel.findOne({
          where: { member_id: member_id, level: vip.level },
        });
        console.log("vipExists>>>>", vipExists);
        if (!vipExists) {
          console.log("not vipExists>>>>", vipExists);
          console.log("new Decimal(vip.bonus)>>>", new Decimal(vip.bonus));
          // Add bonus to balance if applicable
          if (vip.bonus > 0) {
            const member_obj = await membersModel.findOne({
              where: { id: member_id },
            });
            let get_exch = await ExchangeModel.findOne({
              attributes: ["usdtPrice"],
              limit: 1,
            });
            console.log("new Decimal(vip.bonus)>>>", new Decimal(vip.bonus));
            const bonus = vip.bonus / get_exch["usdtPrice"];
            console.log("bonus>>>", bonus);
            member_obj.user_usdt_balance = new Decimal(
              member_obj.user_usdt_balance || 0
            ).plus(new Decimal(bonus));
            member_obj.vip_level = vip.level;
            await member_obj.save();
          } else {
            console.log("less then 0", new Decimal(vip.bonus));
          }

          // Insert into VIP bonus members table
          await VipBonusMemberModel.create({
            member_id: member_id,
            level: vip.level,
            amount: vip.bonus,
          });

          // Prepare notification data
          const body = {
            status: 1,
            message: vip.message,
            type: `${vip.level}_vip_level`,
            id: member_id,
          };

          // Send notification
          let notificationData = {};
          notificationData.member_id = member_id;
          notificationData.title = vip.title;
          notificationData.body = body;
          socket.emit("sendNotification", {
            data: notificationData,
          });

          // Insert into notification_tbls
          await NotificationTblModel.create({
            member_id: member_id,
            title: vip.title,
            body: JSON.stringify(body),
            message_type: "vip",
            created_at: currentDate,
            expire_time: expirationDate,
          });
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Error handling VIP level upgrade:", error);
    throw error;
  }
}
// Helper function for getting total bet amount by Member
export async function getTotalbet(member_id, currency = null) {
  try {
    const baseWhere = { member_id };
    if (currency) {
      baseWhere.currency = currency;
    }

    // Plinko
    const [plinkoResult] = await PlinkoModel.findAll({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('debit_amount')), 'total']],
      where: baseWhere,
      raw: true,
    });

    // Casino
    const [casinoResult] = await CasinoHistoryModel.findAll({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('debit_amount')), 'total']],
      where: baseWhere,
      raw: true,
    });

    // Sports
    const [sportsResult] = await SportPlacedHistoryModel.findAll({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('debit_amount')), 'total']],
      where: baseWhere,
      raw: true,
    });

    const totalPlinko = parseFloat(plinkoResult.total) || 0;
    const totalCasino = parseFloat(casinoResult.total) || 0;
    const totalSports = parseFloat(sportsResult.total) || 0;

    const grandTotal = totalPlinko + totalCasino + totalSports;

    return grandTotal;
  } catch (error) {
    console.error("Error getting total bet:", error);
    throw error;
  }
}

export async function getPrice(currency) {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        'Accept': 'application/json'
      },
      params: {
        symbol: currency,
        convert: 'USD'
      }
    });
    return response.data.data[currency].quote.USD.price;
  } catch (error) {
    console.error('CMC API error:', error.response?.data || error.message);
    return false;
  }
}

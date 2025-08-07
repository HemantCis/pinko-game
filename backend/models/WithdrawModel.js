"use strict";
import dbCon from "../config/dbCon.js";
import { Sequelize, DataTypes } from "sequelize";
import membersModel from "../models/membersModel.js";

const WithdrawModel = dbCon.define(
  "withdraws",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    money: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    bank_str: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userMemo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    old_balance: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    new_balance: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    is_member: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    done_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coin_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    user_btc_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    user_eth_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    user_usdt_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    user_bnb_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    user_sol_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    user_usdc_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    user_trx_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    coin_price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    cash_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

WithdrawModel.associate = function () {
  WithdrawModel.belongsTo(membersModel, {
    foreignKey: "member_id",
  });
};

WithdrawModel.sync();
export default WithdrawModel;

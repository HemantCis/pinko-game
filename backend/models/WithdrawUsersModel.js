"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";

const WithdrawUsersModel = dbCon.define(
  "withdraw_users",
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
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    network: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fee: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(20, 15),
      allowNull: true,
    },
    actually_paid: {
      type: DataTypes.DECIMAL(20, 15),
      allowNull: true,
    },
    money: {
      type: DataTypes.DECIMAL(50, 15),
      allowNull: true,
    },
    payAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payout_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    batch_withdrawal_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    old_balance: {
      type: DataTypes.DECIMAL(20, 15),
      allowNull: true,
    },
    new_balance: {
      type: DataTypes.DECIMAL(20, 15),
      allowNull: true,
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    done_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "withdraw_users",
    timestamps: false,
  }
);

WithdrawUsersModel.sync();
export default WithdrawUsersModel;

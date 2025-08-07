"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";

const DepositUsersModel = dbCon.define(
  "deposit_users",
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
    payAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    invoice_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    purchase_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    money: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    amount: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    actually_paid: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    pay_amount: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    old_balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    new_balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    done_at: {
      type: DataTypes.DATE,
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
    payout_hash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payin_hash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "deposit_users",
    timestamps: false,
  }
);

DepositUsersModel.sync();
export default DepositUsersModel;

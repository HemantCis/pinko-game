"use strict";
import dbCon from "../config/dbCon.js";
import membersModel from "../models/membersModel.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";
import casinoGameListModel from "../models/casinoGameListModel.js";

const DepositModel = dbCon.define(
  "deposits",
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
    name: {
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
    cash_type: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    done_at: {
      type: DataTypes.DATE,
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
    money: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_member: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    txid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coin_amount: {
      type: DataTypes.DECIMAL(32, 16),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rolled: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rolled_amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rolling_percent: {
      type: DataTypes.INTEGER,
      defaultValue: 300,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coin_price: {
      type: DataTypes.DOUBLE,
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

DepositModel.associate = function () {
  DepositModel.belongsTo(membersModel, {
    foreignKey: "member_id",
  });
};

DepositModel.sync();
export default DepositModel;

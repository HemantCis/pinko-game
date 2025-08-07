"use strict";
import dbCon from "../config/dbCon.js";
import { Sequelize, DataTypes } from "sequelize";
import membersModel from "../models/membersModel.js";

const MoneyHistoryModel = dbCon.define(
  "money_history",
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
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amoney: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bmoney: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bet_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bet_result: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

MoneyHistoryModel.associate = function () {
  MoneyHistoryModel.belongsTo(membersModel, {
    foreignKey: "member_id",
  });
};

MoneyHistoryModel.sync();
export default MoneyHistoryModel;

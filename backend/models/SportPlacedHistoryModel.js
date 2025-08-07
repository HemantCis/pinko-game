"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";
import membersModel from "../models/membersModel.js";

const SportPlacedHistoryModel = dbCon.define(
  "sport_placed_history",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    transaction_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bet_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    debit_amount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    credit_amount: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    Bet_state: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bet_type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    selections: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    total_price: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created: {
      type: DataTypes.DATE,
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
    timestamps: false,
  }
);

SportPlacedHistoryModel.associate = function () {
  SportPlacedHistoryModel.belongsTo(membersModel, {
    foreignKey: "member_id",
  });
};

SportPlacedHistoryModel.sync();
export default SportPlacedHistoryModel;

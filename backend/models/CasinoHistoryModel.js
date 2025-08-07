"use strict";
import dbCon from "../config/dbCon.js";
import membersModel from "../models/membersModel.js";
import { Sequelize, DataTypes } from "sequelize";

const CasinoHistoryModel = dbCon.define(
  "casino_history",
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
    casino_remote_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    last_request: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    debit_amount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    credit_amount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    game_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_hash: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gameplay_final: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    round_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gamesession_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_failed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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

CasinoHistoryModel.associate = function () {
  CasinoHistoryModel.belongsTo(membersModel, {
    foreignKey: "member_id",
  });
};

CasinoHistoryModel.sync();
export default CasinoHistoryModel;

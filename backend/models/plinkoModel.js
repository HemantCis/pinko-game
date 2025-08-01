"use strict";
import dbCon from "../config/dbCon.js";
import membersModel from "../models/membersModel.js";
import { Sequelize, DataTypes } from "sequelize";

const PlinkoModel = dbCon.define(
  "plinko_history",
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
    debit_amount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    credit_amount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientSeed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dropValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    multiplier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serverSeed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ticket: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING,
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

PlinkoModel.associate = function () {
  CasinoHistoryModel.belongsTo(membersModel, {
    foreignKey: "member_id",
  });
};

PlinkoModel.sync();
export default PlinkoModel;

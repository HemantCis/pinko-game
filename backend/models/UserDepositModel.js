"use strict";
import dbCon from "../config/dbCon.js";
import membersModel from "../models/membersModel.js";
import { Sequelize, DataTypes } from "sequelize";

const UserDebitModel = dbCon.define(
  "user_debit_history",
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
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

UserDebitModel.associate = function () {
  UserDebitModel.belongsTo(membersModel, {
    foreignKey: "member_id",
  });
};

UserDebitModel.sync();
export default UserDebitModel;

"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";
import casinoGameListModel from "../models/casinoGameListModel.js";
import membersModel from "../models/membersModel.js";

const ClaimReloadBonusModel = dbCon.define(
  "claim_reload_bonus",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    reload_bonus_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    claim_price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    claimed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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

ClaimReloadBonusModel.sync();
export default ClaimReloadBonusModel;

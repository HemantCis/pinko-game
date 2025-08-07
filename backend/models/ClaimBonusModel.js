"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";
import membersModel from "../models/membersModel.js";

const ClaimBonusModel = dbCon.define(
  "claim_bonus",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    bonus_id: {
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

ClaimBonusModel.associate = function () {
  ClaimBonusModel.belongsTo(membersModel, {
    foreignKey: "member_id",
  });
};

ClaimBonusModel.sync();
export default ClaimBonusModel;

"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";
import casinoGameListModel from "../models/casinoGameListModel.js";
import membersModel from "../models/membersModel.js";

const ConfigurationModel = dbCon.define(
  "configurations",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    deposit_min: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deposit_max: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    withdraw_min: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    withdraw_max: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    btcAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "bc1qz7f69cupc9wwmlqrl8qlzl68s3yfyyx69q0whw",
    },
    ethAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "0x3D3D57F488EEB50462749522CE645eF4F628e785	",
    },
    usdtAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "0x235891C978457B43A417567E681Ea8a900259436",
    },
    usdtAddressTrc20: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "0x235891C978457B43A417567E681Ea8a900259436",
    },
    bnbAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "0x235891C978457B43A417567E681Ea8a900259436",
    },
    solAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "0x235891C978457B43A417567E681Ea8a900259436",
    },
    usdcAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "0x235891C978457B43A417567E681Ea8a900259436",
    },
    trxAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "0x235891C978457B43A417567E681Ea8a900259436",
    },
    bank_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bronze_bank_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    silver_bank_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gold_bank_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    platinum_bank_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emerald_bank_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    diamond_bank_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    obsidian_bank_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    default_withdraw_amount: {
      type: DataTypes.DECIMAL(20, 15),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

ConfigurationModel.sync();
export default ConfigurationModel;

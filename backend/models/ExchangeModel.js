"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";
import casinoGameListModel from "../models/casinoGameListModel.js";
import membersModel from "../models/membersModel.js";

const ExchangeModel = dbCon.define(
  "exchanges",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    btcPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    ethPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    usdtPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    bnbPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    solPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    usdcPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    trxPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    xrpPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    dogePrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    shibPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    tonPrice: {
      type: DataTypes.DOUBLE,
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
  },
  {
    timestamps: false,
  }
);

ExchangeModel.sync();
export default ExchangeModel;

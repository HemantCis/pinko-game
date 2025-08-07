"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";
import casinoGameListModel from "../models/casinoGameListModel.js";
import membersModel from "../models/membersModel.js";

const PromotionModel = dbCon.define(
  "promotions",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    sub_title: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
    },
    bonus_type: {
      type: DataTypes.STRING,
    },
    min_price: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    ticket: {
      type: DataTypes.TEXT,
    },
    how_to_enter: {
      type: DataTypes.TEXT,
    },
    terms_condition: {
      type: DataTypes.TEXT,
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

PromotionModel.sync();
export default PromotionModel;

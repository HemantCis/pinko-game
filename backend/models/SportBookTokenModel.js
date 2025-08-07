"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";
import casinoGameListModel from "../models/casinoGameListModel.js";
import membersModel from "../models/membersModel.js";

const SportBookTokenModel = dbCon.define(
  "sports_book_token",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    auth_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expire_ts: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hash: {
      type: DataTypes.STRING,
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

SportBookTokenModel.associate = function () {
  SportBookTokenModel.belongsTo(membersModel, {
    foreignKey: "member_id",
  });
};

SportBookTokenModel.sync();
export default SportBookTokenModel;

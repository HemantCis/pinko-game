"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";
import casinoGameListModel from "../models/casinoGameListModel.js";

const providerImageModel = dbCon.define(
  "providers_image",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    provider_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    provider_images: {
      type: DataTypes.TEXT,
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

providerImageModel.associate = function () {
  providerImageModel.belongsTo(UserModel, {
    foreignKey: "provider_name",
    as: "providers_images",
  });
};

providerImageModel.sync();
export default providerImageModel;

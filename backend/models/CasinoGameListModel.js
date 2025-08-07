"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";
import providerImageModel from "../models/providerImageModel.js";

const casinoGameListModel = dbCon.define(
  "casino_game_list",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    game_id: {
      type: DataTypes.STRING,
    },
    id_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    new: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    system: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    licence: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    plays: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rtp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    wagering: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gamename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    report: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    release_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    show_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hide_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lottie: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hiding_reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    additional: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_parent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_hash_parent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    freerounds_supported: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    featurebuy_supported: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    has_jackpot: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    provider_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    play_for_fun_supported: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_preview: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_filled: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_portrait: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_square: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_background: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_lottie: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_portrait_lottie: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_square_lottie: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_bw: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_portrait_json: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_square_json: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_square_json: {
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

casinoGameListModel.hasOne(providerImageModel, {
  foreignKey: "provider_name",
});

casinoGameListModel.sync();
export default casinoGameListModel;

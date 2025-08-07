"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";

const CasinoGameListModel = dbCon.define(
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
    },
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    subcategory: {
      type: DataTypes.STRING,
    },
    details: {
      type: DataTypes.STRING,
    },
    new: {
      type: DataTypes.STRING,
    },
    system: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    licence: {
      type: DataTypes.STRING,
    },
    plays: {
      type: DataTypes.STRING,
    },
    rtp: {
      type: DataTypes.STRING,
    },
    wagering: {
      type: DataTypes.STRING,
    },
    gamename: {
      type: DataTypes.STRING,
    },
    report: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    release_date: {
      type: DataTypes.STRING,
    },
    show_date: {
      type: DataTypes.STRING,
    },
    hide_date: {
      type: DataTypes.STRING,
    },
    lottie: {
      type: DataTypes.STRING,
    },
    hiding_reason: {
      type: DataTypes.STRING,
    },
    additional: {
      type: DataTypes.STRING,
    },
    id_parent: {
      type: DataTypes.STRING,
    },
    id_hash_parent: {
      type: DataTypes.STRING,
    },
    freerounds_supported: {
      type: DataTypes.STRING,
    },
    featurebuy_supported: {
      type: DataTypes.STRING,
    },
    has_jackpot: {
      type: DataTypes.STRING,
    },
    provider: {
      type: DataTypes.STRING,
    },
    provider_name: {
      type: DataTypes.STRING,
    },
    play_for_fun_supported: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    image_preview: {
      type: DataTypes.STRING,
    },
    image_filled: {
      type: DataTypes.STRING,
    },
    image_portrait: {
      type: DataTypes.STRING,
    },
    image_square: {
      type: DataTypes.STRING,
    },
    image_background: {
      type: DataTypes.STRING,
    },
    image_lottie: {
      type: DataTypes.STRING,
    },
    image_portrait_lottie: {
      type: DataTypes.STRING,
    },
    image_square_lottie: {
      type: DataTypes.STRING,
    },
    image_bw: {
      type: DataTypes.STRING,
    },
    image_portrait_json: {
      type: DataTypes.STRING,
    },
    image_square_json: {
      type: DataTypes.STRING,
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

CasinoGameListModel.sync();
export default CasinoGameListModel;

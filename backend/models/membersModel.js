"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";

const Members = dbCon.define(
  "members",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    member_unique_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twoFASecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authentication_string: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nick_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referral_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sponsor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    game_money: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    casino_money: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    game_point: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    is_delete: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    is_blocked: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_code: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    bank_owner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pin_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accepted: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    user_balance: {
      type: DataTypes.STRING,
      default: 0,
    },
    user_btc_balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    user_eth_balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    user_usdt_balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    user_bnb_balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    user_sol_balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    user_usdc_balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    user_trx_balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    user_xrp_balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    user_doge_balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    user_shib_balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    user_ton_balance: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0.0,
    },
    device_token: {
      type: DataTypes.STRING,
      default: null,
    },
    vip_level: {
      type: DataTypes.STRING,
      default: "Star",
    },
    birth_year: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    birth_month: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    birth_date: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    origin_pw: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ghost_mode: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    community_ghost_mode: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    hide_statistics: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    hide_race_statistics: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    receive_marketing_mail: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    casino_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    casino_remote_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_type: {
      type: DataTypes.INTEGER,
      default: 1,
    },
    commission: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    email_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    current_ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    join_ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_used_at: {
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
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
  }
);

Members.sync();
export default Members;

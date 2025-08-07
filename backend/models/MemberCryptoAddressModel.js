"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";
import casinoGameListModel from "../models/casinoGameListModel.js";
import membersModel from "../models/membersModel.js";

const MemberCryptoAddressModel = dbCon.define("member_crypto_adress_tbls", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  member_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  network: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pay_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expiration_estimate_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
  },
  expire_time: {
    type: DataTypes.DATE,
  },
});

MemberCryptoAddressModel.sync();
export default MemberCryptoAddressModel;

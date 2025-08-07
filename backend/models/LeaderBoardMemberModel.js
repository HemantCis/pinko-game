"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";

const LeaderBoardsMemberModel = dbCon.define(
  "leaderboard_members",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ranking_id: {
      type: DataTypes.STRING,
    },
    member_id: {
      type: DataTypes.STRING,
    },
    price: {
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

LeaderBoardsMemberModel.sync();
export default LeaderBoardsMemberModel;

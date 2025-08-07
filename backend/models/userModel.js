"use strict";
import dbCon from "../config/dbCon.js";
import Models from "./models.js";
import { Sequelize, DataTypes } from "sequelize";

const Users = dbCon.define(
    "users", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        username:{
            type: DataTypes.STRING,
            allowNull: false
        },
        ID :{
            type: DataTypes.STRING,
            allowNull: true
        },
        email :{
            type: DataTypes.STRING
        },
        password :{
            type: DataTypes.STRING,
        },
        user_type :{
            type: DataTypes.STRING,
            enum: ['user', 'vip-user'],
            default: 'user',
        },
        phone  :{
            type: DataTypes.STRING,
            allowNull: true
        },
        status :{
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        created_at :{
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at :{
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false
    }
);

Users.sync();

export default Users;

// module.exports = Users;
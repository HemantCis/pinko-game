import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD);
console.log(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_PASSWORD);


const sequelize = new Sequelize(
  process.env.DB_NAME || "eurobet",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "root",
  {
    host: process.env.DB_HOST ,
    port: process.env.DB_PORT || 3366,
    dialect: "mysql",
    logging: console.log,
    define: {
      timestamps: false,
    },
    timezone: "+09:00",
    dialectOptions: {
      timezone: "Z", // Force MySQL to store in UTC
    },
    pool: {
      max: 30,
      min: 5,
      acquire: 90000,
      idle: 20000,
    },
    // timezone: "Asia/Seoul",
  }
);
sequelize
  .sync()
  .then(() => {
    console.log("DB connection Established");
  })
  .catch((err) => {
    console.log("Error occure while connecting DB, Error=>>>", err);
  });

export default sequelize;

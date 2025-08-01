import dotenv from "dotenv";
dotenv.config();

export = {
  PORT: process.env.PORT || 5000,
  SECRET: process.env.SECRET!,
  RANDOMORG_APIKEY: process.env.RANDOMORG_APIKEY!,
  RPC_URL: process.env.RPC_URL!
};

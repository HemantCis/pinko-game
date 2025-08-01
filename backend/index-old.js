import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import betRoutes from "./routes/betRoutes.js";
import casinoRoutes from "./routes/casinoRoutes.js";
import sportsRoutes from "./routes/sportsRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import transactionRoute from "./routes/transactionRoute.js";
import commonRoutes from "./routes/commonRoutes.js";
import leaderBoardRoutes from "./routes/leaderBoardRoutes.js";
import bonusRoutes from "./routes/bonusRoutes.js";
import WalletController from "./controller/WalletController.js";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import cron from "node-cron";

// Create an Express application
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO and attach it to the HTTP server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins to connect
  },
});

// Handle new socket connections
io.on("connection", (socket) => {
  socket.on("betPlaced", (data) => {
    socket.broadcast.emit("betPlaced", data);
  });

  socket.on("getAllBet", (data) => {
    socket.broadcast.emit("getAllBet", data);
  });

  socket.on("getLeaderBoard", (data) => {
    socket.broadcast.emit("getLeaderBoard", data);
  });
});

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Schedule tasks to be run on the server
// cron.schedule('* * * * *', () => {
//   console.log('Running a task every minute');
//   // Your task code here, e.g., sending an email, cleaning up the database, etc.
// });

// Auth API's
app.use("/", authRoutes);
app.use("/bet/", betRoutes);
app.use("/casino/", casinoRoutes);
app.use("/sports/", sportsRoutes);
app.use("/wallet/", walletRoutes);
app.use("/history/", transactionRoute);
app.use("/common/", commonRoutes);
app.use("/leaderboard", leaderBoardRoutes);
app.use("/bonus", bonusRoutes);
// Schedule tasks to be run on the server
cron.schedule("* * * * *", async () => {
  console.log("cron is wokring ");
  try {
    // Call the controller function directly
    await WalletController.insertCryptoPrice();
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is working on ${PORT}`);
});

import express from "express";
import cors from "cors";
import plinkoRoutes from "./routes/plinkoRoutes.js";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import cron from "node-cron";
import rateLimit from "express-rate-limit";
import axios from "axios";
import qs from "querystring";
import { registerPlinkoHandlers, plinkoBetResultFun } from "./helper/plinkoHandlers.js";


const CLOUDFLARE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
console.log(CLOUDFLARE_SECRET_KEY, "CLOUDFLARE_SECRET_KEY");

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

const allowedOrigins = ["https://novobet.io", "https://ten-ten10.com", "http://localhost:3000"];
app.use(cors({ origin: allowedOrigins, methods: ["GET", "POST", "OPTIONS"], credentials: true }));


// Handle new socket connections
io.on("connection", (socket) => {
  socket.on("getbalance", (data) => {
    console.log("running getbalance");
    socket.broadcast.emit("getbalance", data);
  });

  socket.on("getCasinoBet", (data) => {
    socket.broadcast.emit("getCasinoBet", data);
  });

  socket.on("getSportsBet", (data) => {
    socket.broadcast.emit("getSportsBet", data);
  });

  socket.on("getLeaderBoard", (data) => {
    socket.broadcast.emit("getLeaderBoard", data);
  });

  socket.on("sendNotification", (data) => {
    console.log("runing sendNotification", data);
    socket.broadcast.emit("sendNotification", data);
  });

  socket.on("getExclusive", (data) => {
    socket.broadcast.emit("getExclusive", data);
  });

  socket.on("logoutMember", (data) => {
    socket.broadcast.emit("logoutMember", data);
  });

  socket.on("depositInfo", (data) => {
    console.log("runing depositInfo", data);
    socket.broadcast.emit("depositInfo", data);
  });

  socket.on("plinko:place_bet", async (payload) => {
    console.log("backend Plinko Place bet payload:", payload);
    registerPlinkoHandlers(payload);
  });

  socket.on("plinko:get_result", async (payload) => {
    console.log("backend Plinko result payload:", payload);
    plinkoBetResultFun(payload);
  })
});

app.use(bodyParser.json());
// app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth API's

app.use("/plinko", plinkoRoutes);

app.post("/ipn_callback", (req, res) => {
  console.log("IPN received:", req.body); // Log the data for debugging
  res.status(200).send("OK"); // Always return status 200 to acknowledge the notification
});


app.post("/api/verify-captcha", async (req, res) => {
  const { turnstileToken } = req.body;

  console.log("Turnstile Token:", turnstileToken);

  // 1. Check if the Turnstile token is present
  if (!turnstileToken) {
    console.warn("Verification failed: CAPTCHA token missing.");
    return res.status(400).json({
      success: false,
      error: "CAPTCHA token missing. Please refresh and try again.",
    });
  }

  // 2. Prepare Cloudflare verification
  const verificationUrl =
    "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const remoteIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    const response = await axios.post(
      verificationUrl,
      qs.stringify({
        secret: CLOUDFLARE_SECRET_KEY,
        response: turnstileToken,
        remoteip: remoteIp,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { success, "error-codes": errorCodes } = response.data;
    console.log("Cloudflare Turnstile response:", response.data);

    if (!success) {
      console.error("Turnstile verification failed:", errorCodes);
      return res.status(403).json({
        success: false,
        error: "CAPTCHA verification failed. Please try again.",
        errorCodes,
      });
    }

    console.log("Cloudflare Turnstile verification successful.");
    return res.status(200).json({
      success: true,
      message: "CAPTCHA verified successfully.",
    });
  } catch (error) {
    console.error("Error verifying CAPTCHA:", error.message);
    if (error.response) {
      console.error("Cloudflare response:", error.response.data);
    }
    console.log("Error details:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error during CAPTCHA verification.",
    });
  }
});

// cron.schedule(
//   "59 11,23 * * *",
//   async () => {
//     console.log("GET GAME Cron is working at 11:59 AM and 11:59 PM KST");
//     try {
//       // Call the controller function directly
//       await BetController.getGames();
//     } catch (error) {
//       console.error("Error in cron job:", error);
//     }
//   },
//   {
//     timezone: "Asia/Seoul",
//   }
// );
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is working on ${PORT}`);
});

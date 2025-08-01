import express from "express";
import path from "path";
import { initSocket } from "./socket";
import config from "./config";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "..", "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "..", "client", "build", "index.html")
    );
  });
}
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Ensure CORS is set to allow your client domain
    methods: ["GET", "POST"],
    credentials: true,
  }
});

io.on("connection", (socket: any) => {
  const req = socket.request as Request;
  initSocket(socket, io, req);
});

server.listen(config.PORT, async () => {
  console.log(`App is running on http://localhost:${config.PORT}`);
});

// Error handling - close server
process.on("unhandledRejection", (err: any) => {
  console.error(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

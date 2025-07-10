import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clientRoutes.js";
import tagclientRoutes from "./routes/tagsclientRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes.js";
import readerRoutes from "./routes/readerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import http from "http";
import espRoutes from "./routes/espRoutes.js";


dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", clientRoutes);
app.use("/api", tagclientRoutes);
app.use("/api", warehouseRoutes);
app.use("/api", readerRoutes);
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", scanRoutes);
app.use("/api", espRoutes);


// Create HTTP server from Express app
const server = http.createServer(app);

// Create WebSocket server on top of the HTTP server
const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on("connection", (ws) => {
  console.log("✅ Client connected via WebSocket");
  clients.add(ws);

  ws.on("close", () => {
    console.log("❌ Client disconnected");
    clients.delete(ws);
  });
});

// Broadcast helper
export function broadcastNewScan(scanData) {
  console.log("📢 Broadcasting:", scanData);
  for (const client of clients) {
    if (client.readyState === 1) {
      client.send(JSON.stringify(scanData));
    }
  }
}

// Start the HTTP server (which also handles WS)
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


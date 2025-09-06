import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import express from "express";
import { Request, Response } from "express";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

console.log("testing the github actions");

const httpServer = app.listen(3000, () => {
  console.log("server listening on port 3000");
});

const wss = new WebSocketServer({
  server: httpServer,
});
const gameManager = GameManager.getInstance();

wss.on("connection", (ws) => {
  console.log("A client connected");

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  try {
    gameManager.addUser(ws);

    ws.on("close", () => {
      console.log("A client disconnected");
      gameManager.deleteUser(null, ws);
    });
  } catch (e) {
    console.error("Error handling WebSocket connection:", e);
  }
});

app.get("/all-games", (req: Request, res: Response) => {
  try {
    const games = GameManager.getInstance().getAllGames();
    res.status(200).send(games);
  } catch (e) {
    console.log(e);
  }
});

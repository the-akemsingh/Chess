import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager();

wss.on("connection", (ws) => {
  console.log("New client connected");

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  try {
    // Add the user to the game manager
    gameManager.addUser(ws);

    // Use 'close' instead of 'disconnect' to handle disconnections
    ws.on("close", () => {
      console.log("Client disconnected");
      gameManager.deleteUser(ws);
    });
  } catch (e) {
    console.error("Error handling WebSocket connection:", e);
  }
});

console.log("WebSocket server is running on ws://localhost:8080");

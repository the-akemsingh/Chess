import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import express from 'express'
import { Request, Response } from "express";
import cors from 'cors'


const app=express();
app.use(cors())
app.use(express.json());

const httpServer=app.listen(3000,()=>{
  console.log("server listening on port 3000");
})

const wss = new WebSocketServer({
  server:httpServer
});
const gameManager = GameManager.getInstance();

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



app.get("/all-games",(req:Request,res:Response)=>{
  try{
    const games=GameManager.getInstance().getAllGames();
    res.status(201).send({games});
  }catch(e){
    console.log(e);
  }
})

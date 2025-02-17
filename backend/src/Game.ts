import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./Messages";
import { createClient, RedisClientType } from "redis";
import { GameManager } from "./GameManager";

export class Game {
  private static redisClient:RedisClientType;

  public player1: WebSocket;
  public player2: WebSocket;
  public player1Name:string;
  public player2Name:string;
  private board: Chess;
  private movesCount: number;
  public gameId: string;

  constructor(player1: WebSocket, player2: WebSocket,player1Name:string,player2Name:string) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.gameId = Math.random().toString();
    this.player1Name=player1Name;
    this.player2Name=player2Name;
    
    Game.redisClient=createClient();
    Game.redisClient.connect();

    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
          id:this.gameId
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
          id:this.gameId
        },
      })
    );
    this.movesCount = 0;
  }

  async makeMove(socket: WebSocket, move: { from: string; to: string }) {
    //stoppping the users to make a move, when its other's turn
    if (this.movesCount % 2 === 0 && socket !== this.player1) {
      return;
    }
    if (this.movesCount % 2 === 1 && socket !== this.player2) {
      return;
    }
    //updating the board
    try {
      //   this.board.move(move);
      const result = this.board.move(move);

      // If the move is invalid, return an error message
      if (!result) {
        socket.send(
          JSON.stringify({
            type: "error",
            payload: "Invalid move!",
          })
        );
        return;
      }

      this.movesCount++;

      
      await Game.redisClient.publish(this.gameId,JSON.stringify(this.board.board()));

      //after the updation, checking if its a CHECKMATE and notifying the users
      if (this.board.isGameOver()) {
        const winner = this.board.turn() === "w" ? "black" : "white";
        const gameOverMessage = JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner,
            move,
          },
        });

        this.player2.send(gameOverMessage);
        this.player1.send(gameOverMessage);

        //  Remove the game from GameManager after completion
        GameManager.getInstance().removeGame(this.gameId);

        return;
      }

      //checking if the game is draw
      //   if (this.board.isDraw()) {
      //   }

      //notifying the users that opponent has maked a move.
      const moveMessage = JSON.stringify({
        type: MOVE,
        move,
      });
      if (this.movesCount % 2 === 0) {
        this.player1.send(moveMessage);
      } else {
        this.player2.send(moveMessage);
      }
    } catch (e) {
      console.log(e);
      return;
    }
  }
  gameBoard(){
    return this.board;
  }
}

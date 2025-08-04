import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE, SPECTATE_UPDATE } from "./Messages";
import { GameManager } from "./GameManager";
import dotenv from "dotenv";
import { RedisPublisher } from "./RedisPublisher";
dotenv.config();

const REDIS_USERNAME = process.env.REDIS_USERNAME;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = Number(process.env.REDIS_PORT);
export class Game {
  private static redisPublisher: RedisPublisher;

  public player1Id: string;
  public player2Id: string;
  public player1Name: string;
  public player2Name: string;
  private board: Chess;
  private movesCount: number;
  public gameId: string;

  constructor(
    player1Id: string,
    player2Id: string,
    player1Name: string,
    player2Name: string,
    gameId?: string
  ) {
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.player1Name = player1Name;
    this.player2Name = player2Name;
    this.board = new Chess();
    if (gameId) {
      this.gameId = gameId;
    } else {
      this.gameId = Math.random().toString();
    }

    Game.redisPublisher = RedisPublisher.getInstance();

    Game.redisPublisher.publish(
      player1Id,
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
          id: this.gameId,
          opponentName: player2Name,
        },
      })
    );

    Game.redisPublisher.publish(
      player2Id,
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
          id: this.gameId,
          opponentName: player1Name,
        },
      })
    );
    this.movesCount = 0;
  }

  async makeMove(playerId: string, move: { from: string; to: string }) {
    //stoppping the users to make a move, when its other's turn
    if (this.movesCount % 2 === 0 && playerId !== this.player1Id) {
      return;
    }
    if (this.movesCount % 2 === 1 && playerId !== this.player2Id) {
      return;
    }
    //updating the board
    try {
      //   this.board.move(move);
      const result = this.board.move(move);

      // If the move is invalid, return an error message
      if (!result) {
        Game.redisPublisher.publish(
          this.player1Id,
          JSON.stringify({
            type: "error",
            payload: "Invalid move!",
          })
        );
        return;
      }

      this.movesCount++;

      //after the updation, checking if its a CHECKMATE and notifying the users
      if (this.board.isGameOver()) {
        console.log("Game Over");
        const winner = this.board.turn() === "w" ? "black" : "white";
        const gameOverMessage = JSON.stringify({
          type: GAME_OVER,
          payload: {
            // gameId: this.gameId,
            winner,
            move,
          },
        });
        const toSpectators = {
          type: SPECTATE_UPDATE,
          payload: {
            board: this.board.fen(),
            winner,
            player1Name: this.player1Name,
            player2Name: this.player2Name,
          },
        };
        Game.redisPublisher.publish(this.player1Id, gameOverMessage);
        Game.redisPublisher.publish(this.player2Id, gameOverMessage);
        Game.redisPublisher.publish(this.gameId, JSON.stringify(toSpectators));

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
       const toSpectators = {
          type: SPECTATE_UPDATE,
          payload: {
            board: this.board.fen(),
            player1Name: this.player1Name,
            player2Name: this.player2Name,
          },
        };
      Game.redisPublisher.publish(this.gameId, JSON.stringify(toSpectators));
      if (this.movesCount % 2 === 0) {
        // this.player1.send(moveMessage);
        Game.redisPublisher.publish(this.player1Id, moveMessage);
      } else {
        // this.player2.send(moveMessage);
        Game.redisPublisher.publish(this.player2Id, moveMessage);
      }
    } catch (e) {
      console.log(e);
      return;
    }
  }
  gameBoard() {
    return this.board;
  }
}

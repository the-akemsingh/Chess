import { Chess } from "chess.js";
import { GAME_OVER, gameStateType, MOVE, SPECTATE_UPDATE } from "./utils/Messages";
import { RedisGameManager } from "./RedisGameManager";
import { RedisPublisher } from "./RedisPublisher";

async function makeMove(
  playerId: string,
  move: { from: string; to: string },
  gameState: gameStateType,
) {
  const redisPublisher = RedisPublisher.getInstance();
  //stoppping the users to make a move, when its other's turn
  if (gameState.movesCount % 2 === 0 && playerId !== gameState.player1Id) {
    return;
  }
  if (gameState.movesCount % 2 === 1 && playerId !== gameState.player2Id) {
    return;
  }
  try {
    console.log("enteredt the makemove funcoitn");
    const gameBoard = new Chess(gameState.game);
    const result = gameBoard.move(move);
    console.log(JSON.stringify(move));

    // If the move is invalid, return an error message
    if (!result) {
      return;
    }
    console.log("move is valid");

    const allGames =
      (await RedisGameManager.getInstance().getGame()) as gameStateType[];
    let gameIndex = -1;
    for (let i = 0; i < allGames.length; i++) {
      if (allGames[i].gameId === gameState.gameId) {
        gameIndex = i;
        break;
      }
    }
    gameState.movesCount++;
    gameState.game = gameBoard.fen();
    if (gameIndex != -1) {
      await RedisGameManager.getInstance().lSet(
        "activeGames",
        gameIndex,
        gameState,
      );
    }
    //after the updation, checking if its a CHECKMATE and notifying the users
    if (gameBoard.isGameOver()) {
      const winner = gameBoard.turn() === "w" ? "black" : "white";
      const gameOverMessage = JSON.stringify({
        type: GAME_OVER,
        payload: {
          winner,
          move,
        },
      });
      const toSpectators = {
        type: SPECTATE_UPDATE,
        payload: {
          board: gameBoard.fen(),
          winner,
          player1Name: gameState.player1Name,
          player2Name: gameState.player2Name,
        },
      };
      await redisPublisher.publish(gameState.player1Id, gameOverMessage);
      await redisPublisher.publish(gameState.player2Id, gameOverMessage);
      await redisPublisher.publish(
        gameState.gameId,
        JSON.stringify(toSpectators),
      );
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
        board: gameBoard.fen(),
        player1Name: gameState.player1Name,
        player2Name: gameState.player2Name,
      },
    };
    await redisPublisher.publish(
      gameState.gameId,
      JSON.stringify(toSpectators),
    );
    console.log("moves count", gameState.movesCount);
    if (gameState.movesCount % 2 === 0) {
      console.log("sending to white");
      await redisPublisher.publish(gameState.player1Id, moveMessage);
    } else {
      console.log("sending to black");
      await redisPublisher.publish(gameState.player2Id, moveMessage);
    }
  } catch (e) {
    console.log(e);
    return;
  }
}

export default makeMove;

import { WebSocket } from "ws";
import {
  ACTIVE,
  GAME_ENDED,
  gameStateType,
  INIT_GAME,
  MOVE,
  SPECTATE,
  SPECTATE_UPDATE,
} from "./utils/Messages";
import { SpectateGame } from "./Spectate";
import { v4 as uuidv4 } from "uuid";
import { WaitingUserQueue } from "./WaitingUserQueue";
import { RedisSubscriber } from "./RedisSubscriber";
import { RedisPublisher } from "./RedisPublisher";
import { Chess } from "chess.js";
import { RedisGameManager } from "./RedisGameManager";
import makeMove from "./MakeMove";

export class GameManager {
  private static instance: GameManager;
  private allUsers: Map<string, WebSocket>;

  private WaitingUserQueue: WaitingUserQueue;
  private RedisSubscriber: RedisSubscriber;
  private RedisPublisher: RedisPublisher;
  private RedisGameManager: RedisGameManager;

  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }

    return GameManager.instance;
  }

  private constructor() {
    this.allUsers = new Map();
    this.WaitingUserQueue = WaitingUserQueue.getInstance();
    this.RedisSubscriber = RedisSubscriber.getInstance();
    this.RedisPublisher = RedisPublisher.getInstance();
    this.RedisGameManager = RedisGameManager.getInstance();
  }

  addUser(socket: WebSocket) {
    try {
      const userId = uuidv4();
      this.allUsers.set(userId, socket);
      this.addHandler(userId, socket);
    } catch (e) {
      console.log(e);
    }
  }

  deleteUser(userId: string | null, socket: WebSocket | null) {
    try {
      let deletedUserId = userId;
      if (userId) {
        const socket = this.allUsers.get(userId);
        if (socket) {
          this.allUsers.delete(userId);
        }
      }
      for (const [userId, userSocket] of this.allUsers.entries()) {
        if (userSocket === socket) {
          deletedUserId = userId;
          this.allUsers.delete(userId);
          break;
        }
      }
      return deletedUserId;
    } catch (e) {
      console.log(e);
    }
  }

  private addHandler(userId: string, socket: WebSocket) {
    try {
      socket.on("message", async (data: string) => {
        const message = JSON.parse(data);

        if (message.type === INIT_GAME) {
          const waitingUser = await this.WaitingUserQueue.getWaitingUser();

          if (waitingUser) {
            const waitingUserData = JSON.parse(waitingUser);

            const gameState: gameStateType = {
              gameId: uuidv4(),
              game: new Chess().fen(),
              player1Id: waitingUserData.userId,
              player2Id: userId,
              player1Name: waitingUserData.name,
              player2Name: message.name,
              isPlayer1Connected: true,
              isPlayer2Connected: true,
              status: ACTIVE,
              movesCount: 0,
            };

            await this.RedisGameManager.lPush("activeGames", gameState);

            //now subscribe for the future game events for itself
            await this.RedisSubscriber.subscribe(userId, socket);

            await this.RedisPublisher.publish(
              gameState.player1Id,
              JSON.stringify({
                type: INIT_GAME,
                payload: {
                  color: "white",
                  id: gameState.gameId,
                  opponentName: gameState.player2Name,
                },
              }),
            );
            await this.RedisPublisher.publish(
              gameState.player2Id,
              JSON.stringify({
                type: INIT_GAME,
                payload: {
                  color: "black",
                  id: gameState.gameId,
                  opponentName: gameState.player1Name,
                },
              }),
            );
          } else {
            const waitingUserData = {
              name: message.name,
              userId,
            };
            //add to the queue
            await this.WaitingUserQueue.addWaitingUser(waitingUserData);
            //here subscribe to events for own userId
            await this.RedisSubscriber.subscribe(userId, socket);
          }
        }

        if (message.type === MOVE) {
          //get the game
          const gameInfo = await this.RedisGameManager.getGame(message.gameId);
          //find this player's id
          let playerId: string | undefined;
          for (const [id, ws] of this.allUsers.entries()) {
            if (ws === socket) {
              playerId = id;
              break;
            }
          }
          console.log("gameID", JSON.stringify(gameInfo));
          //making move
          if (gameInfo) {
            makeMove(
              playerId as string,
              message.move,
              gameInfo as gameStateType,
            );
          }
        }

        if (message.type === SPECTATE) {
          const gameId = message.gameId;
          SpectateGame.getInstance().subscribe(gameId, socket);
        }
      });

      socket.on("close", async () => {
        const deletedUserId = this.deleteUser(null, socket);
        const allGames =
          (await this.RedisGameManager.getGame()) as gameStateType[];
        let playerName;
        if (allGames) {
          const playerGame = allGames.find((game) => {
            return (
              game.player1Id === deletedUserId ||
              game.player2Id === deletedUserId
            );
          });

          if (playerGame) {
            if (playerGame.player1Id === userId) {
              playerName = playerGame.player1Name;
              await this.RedisPublisher.publish(
                playerGame.player2Id,
                JSON.stringify({
                  type: GAME_ENDED,
                  reason: "Opponent disconnected",
                }),
              );
            }

            if (playerGame.player2Id === userId) {
              playerName = playerGame.player2Name;
              await this.RedisPublisher.publish(
                playerGame.player1Id,
                JSON.stringify({
                  type: GAME_ENDED,
                  reason: "Opponent disconnected",
                }),
              );
            }

            const toSpectators = {
              type: SPECTATE_UPDATE,
              leaved: true,
              playerId: userId,
              playerName,
            };
            await this.RedisPublisher.publish(
              playerGame.gameId,
              JSON.stringify(toSpectators),
            );
          }
        }

        //unsubscribe to events this socket had subscribed
        await this.RedisSubscriber.unSubscribe(socket);

        // //if the use was waiting user
        const isThisUserWaiting = await this.WaitingUserQueue.isThisUserWaiting(
          deletedUserId as string,
        );
        if (isThisUserWaiting) {
          await this.WaitingUserQueue.removeWaitingUser();
        }
        // If the user was spectating, unsubscribe them
        SpectateGame.getInstance().unsubscribeByInstance(socket);
      });
    } catch (e) {
      console.log(e);
    }
  }
}

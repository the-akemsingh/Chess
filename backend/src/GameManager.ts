import { WebSocket } from "ws";
import {
  GAME_ENDED,
  INIT_GAME,
  MOVE,
  PLAYER_MATCHED,
  SPECTATE,
  SPECTATE_UPDATE,
} from "./Messages";
import { Game } from "./Game";
import { SpectateGame } from "./Spectate";
import { v4 as uuidv4 } from "uuid";
import { WaitingUserQueue } from "./WaitingUserQueue";
import { RedisSubscriber } from "./RedisSubscriber";
import { RedisPublisher } from "./RedisPublisher";

export class GameManager {
  private static instance: GameManager;
  private games: Map<
    string,
    { game: Game; player1Id: string; player2Id: string }
  >;
  private allUsers: Map<string, WebSocket>;

  private WaitingUserQueue: WaitingUserQueue;
  private RedisSubscriber: RedisSubscriber;
  private RedisPublisher: RedisPublisher;

  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }

    return GameManager.instance;
  }

  private constructor() {
    this.games = new Map();
    this.allUsers = new Map();
    this.WaitingUserQueue = WaitingUserQueue.getInstance();
    this.RedisSubscriber = RedisSubscriber.getInstance();
    this.RedisPublisher = RedisPublisher.getInstance();
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
      if (userId) {
        const socket = this.allUsers.get(userId);
        if (socket) {
          this.allUsers.delete(userId);
        }
      }
      for (const [userId, userSocket] of this.allUsers.entries()) {
        if (userSocket === socket) {
          this.allUsers.delete(userId);
          break;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  private addHandler(userId: string, socket: WebSocket) {
    try {
      socket.on("message", async (data: string) => {
        const message = JSON.parse(data);

        if (message.type === INIT_GAME) {
          const isAnyUserWaiting =
            await this.WaitingUserQueue.checkWaitingUser();

          console.log("Is any user waiting:", isAnyUserWaiting);

          if (isAnyUserWaiting) {
            const waitingUserData = JSON.parse(
              (await this.WaitingUserQueue.getWaitingUser()) as string
            );

            const game = new Game(
              waitingUserData.userId,
              userId,
              waitingUserData.name,
              message.name
            );

            this.games.set(game.gameId, {
              game,
              player1Id: waitingUserData.userId,
              player2Id: userId,
            });

            //publish for the waiting user - that match is found
            const messageToPublish = {
              type: PLAYER_MATCHED,
              userId: userId, // player2Id
              userName: message.name, // player2Name
              waitingUserName: waitingUserData.name, // player1Name
              gameId: game.gameId, // gameId
            };

            this.RedisPublisher.publish(
              waitingUserData.userId,
              JSON.stringify(messageToPublish)
            );

            //now subscribe for the future game events for itself
            this.RedisSubscriber.subscribe(userId, socket);
          } else {
            console.log("No waiting user found, adding to queue");
            const waitingUserData = JSON.stringify({
              name: message.name,
              userId,
            });
            console.log("Waiting user data:", waitingUserData);
            //add to the queue
            this.WaitingUserQueue.addWaitingUser(waitingUserData);
            //here subscribe to events for own userId
            this.RedisSubscriber.subscribe(userId, socket);
          }
        }

        if (message.type === MOVE) {
          //get the game
          const gameInfo = this.games.get(message.gameId);
          //find this player's id
          let playerId: string | undefined;
          for (const [id, ws] of this.allUsers.entries()) {
            if (ws === socket) {
              playerId = id;
              break;
            }
          }
          //making move
          if (gameInfo) {
            gameInfo.game.makeMove(playerId as string, message.move);
          }
        }

        if (message.type === SPECTATE) {
          const gameId = message.gameId;
          SpectateGame.getInstance().subscribe(gameId, socket);
        }
      });
      socket.on("close", async () => {
        this.deleteUser(null, socket);
        let playerName: string = "";
        for (const [
          gameId,
          { game, player1Id, player2Id },
        ] of this.games.entries()) {
          if (player1Id === userId) {
            playerName = game.player1Name;
            this.RedisPublisher.publish(
              player2Id,
              JSON.stringify({
                type: GAME_ENDED,
                reason: "Opponent disconnected",
              })
            );
          }
          if (player2Id === userId) {
            playerName = game.player2Name;
            this.RedisPublisher.publish(
              player1Id,
              JSON.stringify({
                type: GAME_ENDED,
                reason: "Opponent disconnected",
              })
            );
          }

          const toSpectators = {
            type: SPECTATE_UPDATE,
            leaved: true,
            playerId: userId,
            playerName
          };
          this.RedisPublisher.publish(gameId, JSON.stringify(toSpectators));

          // //if the use was waiting user
          this.WaitingUserQueue.removeWaitingUser();

          // If the user was spectating, unsubscribe them
          SpectateGame.getInstance().unsubscribeByInstance(socket);

          this.games.delete(gameId);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  addGame(game: Game, player1Id: string, player2Id: string) {
    this.games.set(game.gameId, { game, player1Id, player2Id });
  }

  getAllGames() {
    return Array.from(this.games.values()).map((gameInfo) => {
      return {
        gameId: gameInfo.game.gameId,
      };
    });
  }

  removeGame(gameId: string) {
    this.games.delete(gameId);
  }
}

import { WebSocket } from "ws";
import { GAME_ENDED, INIT_GAME, MOVE, SPECTATE } from "./Messages";
import { Game } from "./Game";
import { SpectateGame } from "./Spectate";

export class GameManager {
  private static instance: GameManager;

  private games: Game[];
  private pendingUser: { socket: WebSocket; name: string } | null;
  private allUsers: Set<WebSocket>;

  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }

    return GameManager.instance;
  }

  private constructor() {
    this.games = [];
    this.pendingUser = null;
    this.allUsers = new Set();
  }

  addUser(socket: WebSocket) {
    try {
      this.allUsers.add(socket);
      this.addHandler(socket);
    } catch (e) {
      console.log(e);
    }
  }

  deleteUser(socket: WebSocket) {
    try {
      this.allUsers.delete(socket);
    } catch (e) {
      console.log(e);
    }
  }

  private addHandler(socket: WebSocket) {
    try {
      socket.on("message", (data: string) => {
        const message = JSON.parse(data);

        if (message.type === INIT_GAME) {
          if (this.pendingUser) {
            const game = new Game(
              this.pendingUser.socket,
              socket,
              this.pendingUser.name,
              message.name
            );
            this.games.push(game);
            this.pendingUser = null;
          } else {
            this.pendingUser = { socket, name: message.name };
          }
        }

        if (message.type === MOVE) {
          const game = this.games.find((game) => {
            return game.player1 === socket || game.player2 === socket;
          });
          if (game) {
            game.makeMove(socket, message.move);
          }
        }

        if (message.type === SPECTATE) {
          const game = this.games.find((game) => {
            return game.gameId === message.gameId;
          });
          if (game) {
            SpectateGame.getInstance().subscribe(message.gameId, socket);
          }
          socket.send(
            JSON.stringify({
              type: SPECTATE,
              game: game?.gameBoard().board(),
              player1: game?.player1Name,
              player2: game?.player2Name,
            })
          );
        }
      });
      socket.on("close", () => {
        console.log("A user disconnected");
      
        this.allUsers.delete(socket);
      
        if (this.pendingUser?.socket === socket) {
          this.pendingUser = null;
        }
      
        // Remove any games the user was part of
        this.games = this.games.filter((game) => {
          if (game.player1 === socket || game.player2 === socket) {
            // If the user was part of this game, notify the opponent
            const opponent = game.player1 === socket ? game.player2 : game.player1;
            if (opponent.readyState === WebSocket.OPEN) {
              opponent.send(
                JSON.stringify({
                  type: GAME_ENDED,
                  reason: "Opponent disconnected",
                })
              );
            }
            return false;
          }
          return true;
        });
      
        // If the user was spectating, unsubscribe them
        SpectateGame.getInstance().unsubscribeByInstance(socket);
      });
      
    } catch (e) {
      console.log(e);
    }
  }

  getAllGames() {
    return this.games.map((game) => game.gameId);
  }

  removeGame(gameId: string) {
    this.games = this.games.filter((game) => game.gameId !== gameId);
  }
}

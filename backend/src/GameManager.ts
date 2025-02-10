import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./Messages";
import { Game } from "./Game";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private allUsers: Set<WebSocket>;

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.allUsers = new Set();
  }

  addUser(socket: WebSocket) {
    try {
      this.allUsers.add(socket);
      this.addHandler(socket)
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
            const game = new Game(this.pendingUser, socket);
            this.games.push(game);
            this.pendingUser = null;
          }
          else{
            this.pendingUser = socket;
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

      });
    } catch (e) {
      console.log(e);
    }
  }
}
import { createClient, RedisClientType } from "redis";
import { WebSocket } from "ws";
import { SPECTATE_UPDATE } from "./Messages";
const record = new Map();

export class SpectateGame {
  private static instance: SpectateGame;
  static getInstance() {
    if (!this.instance) {
      SpectateGame.instance = new SpectateGame();
    }

    return SpectateGame.instance;
  }

  private redisClient: RedisClientType;
  private subscriptions: Map<string, Set<WebSocket>>;

  constructor() {
    this.redisClient = createClient();
    this.redisClient.connect();
    this.subscriptions = new Map();
  }


  subscribe(gameId: string, user: WebSocket) {
    if (!this.subscriptions.has(gameId)) {
      this.subscriptions.set(gameId, new Set());
    }

    this.subscriptions.get(gameId)?.add(user);
    if (this.subscriptions.get(gameId)?.size === 1) {
      this.redisClient.subscribe(gameId, (message) => {
        this.updateHandler(gameId, message);
      });
    }
  }

  updateHandler(gameId: string, message: string) {
    console.log(`message received for gameId ${gameId} is ${message} `);
    const parsedBoard = JSON.parse(message); 
    this.subscriptions.get(gameId)?.forEach(ws => {
      ws.send(JSON.stringify({
        type:SPECTATE_UPDATE,
        payload:parsedBoard
      }))
    });
  }

  unsubscribe(gameId: string, user: WebSocket) {
    this.subscriptions.get(gameId)?.delete(user);

    if (this.subscriptions.get(gameId)?.size === 0) {
      this.redisClient.unsubscribe(gameId);
      this.subscriptions.delete(gameId);
    }
  }
}

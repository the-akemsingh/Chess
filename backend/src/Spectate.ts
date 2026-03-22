import { createClient, RedisClientType } from "redis";
import { WebSocket } from "ws";
import dotenv from "dotenv";
import { Redis } from "./utils/RedisCreds";
dotenv.config();

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
    Redis.validateCredentials();
    this.redisClient = createClient({
      username: Redis.get("REDIS_USERNAME"),
      password: Redis.get("REDIS_PASSWORD"),
      socket: {
        host: Redis.get("REDIS_HOST"),
        port: Redis.get("REDIS_PORT"),
      },
    });
    this.redisClient.connect();
    this.subscriptions = new Map();
  }

  subscribe(gameId: string, user: WebSocket) {
    try {
      if (!this.subscriptions.has(gameId)) {
        this.subscriptions.set(gameId, new Set());
      }

      this.subscriptions.get(gameId)?.add(user);
      if (this.subscriptions.get(gameId)?.size === 1) {
        this.redisClient.subscribe(gameId, (message) => {
          this.updateHandler(gameId, message);
        });
      }
    } catch (e) {
      console.error("Error subscribing to game:", e);
      return;
    }
  }

  updateHandler(gameId: string, message: string) {
    this.subscriptions.get(gameId)?.forEach((ws) => {
      ws.send(message);
    });
  }

  //this method is not used anywhere till now - LOL
  unsubscribe(gameId: string, user: WebSocket) {
    try {
      this.subscriptions.get(gameId)?.delete(user);

      if (this.subscriptions.get(gameId)?.size === 0) {
        this.redisClient.unsubscribe(gameId);
        this.subscriptions.delete(gameId);
      }
    } catch (e) {
      console.error("Error unsubscribing from game:", e);
      return;
    }
  }

  unsubscribeByInstance(user: WebSocket) {
    try {
      for (const [gameId, users] of this.subscriptions) {
        users.delete(user);
        if (users.size === 0) {
          this.redisClient.unsubscribe(gameId);
          this.subscriptions.delete(gameId);
        }
      }
    } catch (e) {
      console.error("Error unsubscribing from all games:", e);
      return;
    }
  }
}

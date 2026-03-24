import WebSocket from "ws";
import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";
import { Redis } from "./utils/RedisCreds";
dotenv.config();

export class RedisSubscriber {
  private static instance: RedisSubscriber;
  private redisClient: RedisClientType;
  private subscriptions: Map<string, Set<WebSocket>>;

  static getInstance() {
    if (!this.instance) {
      RedisSubscriber.instance = new RedisSubscriber();
    }
    return RedisSubscriber.instance;
  }

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

  async subscribe(userId: string, socket: WebSocket) {
    if (!this.subscriptions.has(userId)) {
      this.subscriptions.set(userId, new Set());
    }

    this.subscriptions.get(userId)?.add(socket);
    try {
      if (this.subscriptions.get(userId)?.size === 1) {
        await this.redisClient.subscribe(userId, (message) => {
          this.subscriptions.get(userId)?.forEach((ws) => {
            ws.send(message);
          });
        });
      }
    } catch (error) {
      console.error("Error subscribing to Redis:", error);
    }
  }
  async unSubscribe(socket: WebSocket) {
    try {
      for (const [userId, sockets] of this.subscriptions) {
        sockets.delete(socket);
        if(sockets.size===0){
          await this.redisClient.unsubscribe(userId);
          this.subscriptions.delete(userId);
        }
      }
    } catch (e) {
      console.error("Error unsubscribing the user");
    }
  }
}

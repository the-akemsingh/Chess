import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";
import { Redis } from "./utils/RedisCreds";
dotenv.config();

export class RedisPublisher {
  private static instance: RedisPublisher;
  private redisClient: RedisClientType;

  static getInstance() {
    if (!this.instance) {
      RedisPublisher.instance = new RedisPublisher();
    }
    return RedisPublisher.instance;
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
  }

  async publish(userId: string, message: string) {
    try {
      await this.redisClient.publish(userId, message);
    } catch (e) {
      console.error("Error publishing message:", e);
      return;
    }
  }
}

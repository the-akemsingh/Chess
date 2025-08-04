import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";
dotenv.config();

const REDIS_USERNAME = process.env.REDIS_USERNAME;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = Number(process.env.REDIS_PORT);

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
    this.redisClient = createClient({
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
      socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },
    });
    this.redisClient.connect();
  }

  publish(userId: string, message: string) {
    try {
      this.redisClient.publish(userId, message);
    } catch (e) {
      console.error("Error publishing message:", e);
      return;
    }
  }
}

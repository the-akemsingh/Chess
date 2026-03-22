import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";
import { Redis } from "./utils/RedisCreds";
dotenv.config();

export class WaitingUserQueue {
  private static instance: WaitingUserQueue;
  private redisClient: RedisClientType;
  private pendingUserId: string | null = null;

  static getInstance(): WaitingUserQueue {
    if (!this.instance) {
      WaitingUserQueue.instance = new WaitingUserQueue();
    }

    return this.instance;
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

  async isAnyUserWaiting(): Promise<boolean> {
    try {
      const result = await this.redisClient.lLen("waitingUser");
      return result > 0;
    } catch (e) {
      console.error("Error checking waiting user:", e);
      return false;
    }
  }

  async addWaitingUser(userData: { userId: string; name: string }) {
    try {
      this.pendingUserId = userData.userId;
      await this.redisClient.lPush("waitingUser", JSON.stringify(userData));
    } catch (e) {
      console.error("Error adding waiting user:", e);
      return;
    }
  }

  async getWaitingUser(): Promise<string | null> {
    try {
      const userData = await this.redisClient.rPop("waitingUser");
      return userData;
    } catch (e) {
      console.error("Error getting waiting user:", e);
      return null;
    }
  }

  async isThisUserWaiting(userId: string): Promise<boolean> {
    try {
      return this.pendingUserId === userId;
    } catch (e) {
      console.error("Error checking if user is waiting:", e);
      return false;
    }
  }

  async removeWaitingUser() {
    try {
      await this.redisClient.rPop("waitingUser");
      this.pendingUserId = null;
    } catch (e) {
      console.error("Error removing waiting user:", e);
      return;
    }
  }
}

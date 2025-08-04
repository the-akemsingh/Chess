import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";
dotenv.config();

const REDIS_USERNAME = process.env.REDIS_USERNAME;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = Number(process.env.REDIS_PORT);

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

  async checkWaitingUser(): Promise<boolean> {
    try {
      const result = await this.redisClient.lRange("waitingUser", -1, -1);
      console.log("Checking waiting user:", result);
      return result.length > 0;
    } catch (e) {
      console.error("Error checking waiting user:", e);
      return false;
    }
  }

  addWaitingUser(userData: string) {
    try {
      this.pendingUserId = JSON.parse(userData).userId;
      this.redisClient.lPush("waitingUser", userData);
      console.log("Added waiting user:", userData);
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

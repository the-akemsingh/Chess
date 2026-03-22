import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";
import { gameStateType } from "./utils/Messages";
import { Redis } from "./utils/RedisCreds";
dotenv.config();

export class RedisGameManager {
  private static instance: RedisGameManager;
  private redisClient: RedisClientType;

  static getInstance() {
    if (!this.instance) {
      RedisGameManager.instance = new RedisGameManager();
    }
    return RedisGameManager.instance;
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

  async lPush(key: string, game: gameStateType) {
    try {
      await this.redisClient.lPush(key, JSON.stringify(game));
    } catch (e) {
      console.error("Error occured:", e);
      return;
    }
  }

  async lSet(key: string, index: number, game: gameStateType) {
    try {
      await this.redisClient.lSet(key, index, JSON.stringify(game));
    } catch (e) {
      console.error("Error occured:", e);
      return;
    }
  }

  async getGame(gameId?: string): Promise<gameStateType | gameStateType[]> {
    try {
      const allGames = await this.redisClient.lRange("activeGames", 0, -1);
      if (gameId) {
        for (const game of allGames) {
          const parsedGame: gameStateType = JSON.parse(game);
          if (parsedGame.gameId === gameId) {
            return parsedGame;
          }
        }
      }
      const parsed = allGames.map((game) => JSON.parse(game));
      return parsed;
    } catch (e) {
      console.error("Error getting game by id:", e);
      return [];
    }
  }
}

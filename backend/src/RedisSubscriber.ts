import WebSocket from "ws";
import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";
import { Game } from "./Game";
import { GameManager } from "./GameManager";
import { PLAYER_MATCHED } from "./Messages";
dotenv.config();

const REDIS_USERNAME = process.env.REDIS_USERNAME;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = Number(process.env.REDIS_PORT);

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
    this.redisClient = createClient({
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
      socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },
    });
    this.redisClient.connect();
    this.subscriptions = new Map();
  }

  subscribe(userId: string, socket: WebSocket) {
    if (!this.subscriptions.has(userId)) {
      this.subscriptions.set(userId, new Set());
    }

    this.subscriptions.get(userId)?.add(socket);
    try {
      if (this.subscriptions.get(userId)?.size === 1) {
        this.redisClient.subscribe(userId, (message) => {
          const parsedMessage = JSON.parse(message);

          if (parsedMessage.type === PLAYER_MATCHED) {
            this.subscriptions.get(userId)?.forEach((ws) => {
              const game = new Game(
                userId, //player1Id
                parsedMessage.userId, //player2Id
                parsedMessage.waitingUserName, //player1Name
                parsedMessage.userName, //player2Name
                parsedMessage.gameId // gameId
              );
              const gameManager = GameManager.getInstance();
              gameManager.addGame(game, userId, parsedMessage.userId);
            });
          } else {
            this.subscriptions.get(userId)?.forEach((ws) => {
              ws.send(message);
            });
          }
        });
      }
    } catch (error) {
      console.error("Error subscribing to Redis:", error);
    }
  }
}

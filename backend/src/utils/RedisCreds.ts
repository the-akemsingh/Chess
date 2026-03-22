import dotenv from "dotenv";

dotenv.config();

interface Credentials {
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
}

class RedisCredentials {
  private static instance: RedisCredentials;
  private credentials: Credentials;

  constructor() {
    this.credentials = {
      REDIS_USERNAME: process.env.REDIS_USERNAME || " ",
      REDIS_PASSWORD: process.env.REDIS_PASSWORD || " ",
      REDIS_HOST: process.env.REDIS_HOST || " ",
      REDIS_PORT: Number(process.env.REDIS_PORT || 3000),
    };
  }

  static getInstance(): RedisCredentials {
    if (!RedisCredentials.instance) {
      RedisCredentials.instance = new RedisCredentials();
    }

    return RedisCredentials.instance;
  }

  public get<K extends keyof Credentials>(key: K): Credentials[K] {
    return this.credentials[key];
  }

  public validateCredentials(): void {
    if (!this.credentials.REDIS_HOST) {
      console.error("Configuration error");
    }
    if (!this.credentials.REDIS_USERNAME) {
      console.error("Configuration error");
    }
    if (!this.credentials.REDIS_PASSWORD) {
      console.error("Configuration error");
    }
    if (!this.credentials.REDIS_PORT) {
      console.error("Configuration error");
    }
  }
}

export const Redis = RedisCredentials.getInstance();

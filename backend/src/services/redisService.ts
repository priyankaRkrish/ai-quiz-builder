import { createClient, RedisClientType } from 'redis';

class RedisService {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('✅ Redis connected successfully');
      this.isConnected = true;
    });

    this.client.on('ready', () => {
      console.log('✅ Redis ready');
      this.isConnected = true;
    });

    this.client.on('end', () => {
      console.log('🔌 Redis connection ended');
      this.isConnected = false;
    });
  }

  async connect() {
    if (!this.isConnected) {
      try {
        await this.client.connect();
        this.isConnected = true;
      } catch (error) {
        console.error('❌ Failed to connect to Redis:', error);
        throw error;
      }
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.connect();
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setEx(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      console.error('❌ Redis set error:', error);
      throw error;
    }
  }

  async get(key: string): Promise<any | null> {
    try {
      await this.connect();
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('❌ Redis get error:', error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.connect();
      await this.client.del(key);
    } catch (error) {
      console.error('❌ Redis delete error:', error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.connect();
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('❌ Redis exists error:', error);
      return false;
    }
  }

  async setQuizCache(topic: string, quizData: any, ttl: number = 3600): Promise<void> {
    const cacheKey = `quiz:${topic.toLowerCase().replace(/\s+/g, '_')}`;
    await this.set(cacheKey, quizData, ttl);
  }

  async getQuizCache(topic: string): Promise<any | null> {
    const cacheKey = `quiz:${topic.toLowerCase().replace(/\s+/g, '_')}`;
    return await this.get(cacheKey);
  }

  async setUserSession(userId: string, sessionData: any, ttl: number = 86400): Promise<void> {
    const cacheKey = `session:${userId}`;
    await this.set(cacheKey, sessionData, ttl);
  }

  async getUserSession(userId: string): Promise<any | null> {
    const cacheKey = `session:${userId}`;
    return await this.get(cacheKey);
  }

  async deleteUserSession(userId: string): Promise<void> {
    const cacheKey = `session:${userId}`;
    await this.delete(cacheKey);
  }
}

export const redisService = new RedisService();
export default redisService;

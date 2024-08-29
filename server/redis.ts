import { createClient, RedisClientType } from 'redis';

const client: RedisClientType = createClient({
  url: 'redis://localhost:6379', // 로컬 Redis 서버
});

const connectRedis = async (): Promise<RedisClientType> => {
  if (!client.isOpen)
    await client.connect();

  return client;
}

export default connectRedis;
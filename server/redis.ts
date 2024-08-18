import { createClient, RedisClientType } from 'redis';

const client: RedisClientType = createClient();

const connectRedis = async (): Promise<RedisClientType> => {
  if (!client.isOpen)
    await client.connect();

  return client;
}

export default connectRedis;
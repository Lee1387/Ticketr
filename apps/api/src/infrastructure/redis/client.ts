import { Redis, type RedisOptions } from "ioredis";

const redisOptions = {
  enableOfflineQueue: false,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
} satisfies RedisOptions;

export type RedisConnection = {
  client: Redis;
  close: () => Promise<void>;
  ping: () => Promise<"PONG">;
};

export type RedisClient = RedisConnection["client"];

export function createRedisConnection(redisUrl: string): RedisConnection {
  const client = new Redis(redisUrl, redisOptions);

  return {
    client,
    close: () => {
      client.disconnect();
      return Promise.resolve();
    },
    ping: () => pingRedis(client),
  };
}

async function pingRedis(client: Redis): Promise<"PONG"> {
  await connectRedis(client);

  return client.ping();
}

async function connectRedis(client: Redis): Promise<void> {
  if (client.status === "wait") {
    await client.connect();
  }
}

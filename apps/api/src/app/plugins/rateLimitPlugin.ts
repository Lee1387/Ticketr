import fastifyRateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";

import type { RedisClient } from "../../infrastructure/redis/client.js";

export type RegisterRateLimitPluginOptions = {
  redisClient?: RedisClient;
};

const baseRateLimitOptions = {
  global: false,
  nameSpace: "ticketr:rate-limit",
  skipOnError: false,
};

export function registerRateLimitPlugin(
  app: FastifyInstance,
  options: RegisterRateLimitPluginOptions = {},
): void {
  const pluginOptions =
    options.redisClient === undefined
      ? baseRateLimitOptions
      : {
          ...baseRateLimitOptions,
          redis: options.redisClient,
        };

  void app.register(fastifyRateLimit, pluginOptions);
}

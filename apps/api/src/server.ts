import { buildApp } from "./app/buildApp.js";
import { parseEnv } from "./app/config/env.js";
import { createAppServices } from "./app/createAppServices.js";
import { createDatabaseConnection } from "./infrastructure/db/client.js";
import { createRedisConnection } from "./infrastructure/redis/client.js";

const env = parseEnv(process.env);
const databaseConnection = createDatabaseConnection(env.DATABASE_URL);
const redisConnection = createRedisConnection(env.REDIS_URL);
const app = buildApp({
  jwtAudience: env.JWT_AUDIENCE,
  jwtIssuer: env.JWT_ISSUER,
  jwtSecret: env.JWT_SECRET,
  nodeEnv: env.NODE_ENV,
  rateLimitRedisClient: redisConnection.client,
  services: createAppServices(databaseConnection.db),
});

app.addHook("onClose", async () => {
  await redisConnection.close();
  await databaseConnection.close();
});

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  app.log.info({ signal }, "Shutting down API server");
  await app.close();
};

function handleShutdownSignal(signal: NodeJS.Signals): void {
  void shutdown(signal).catch((error: unknown) => {
    app.log.error({ err: error, signal }, "Failed to shut down API server");
    process.exitCode = 1;
  });
}

process.once("SIGINT", handleShutdownSignal);
process.once("SIGTERM", handleShutdownSignal);

try {
  await redisConnection.ping();
  await app.listen({
    host: env.API_HOST,
    port: env.API_PORT,
  });
} catch (error) {
  app.log.error({ err: error }, "Failed to start API server");
  await app.close();
  process.exitCode = 1;
}

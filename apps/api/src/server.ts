import { buildApp } from "./app/buildApp.js";
import { parseEnv } from "./app/config/env.js";

const env = parseEnv(process.env);
const app = buildApp();

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  app.log.info({ signal }, "Shutting down API server");
  await app.close();
};

process.once("SIGINT", (signal) => {
  void shutdown(signal);
});

process.once("SIGTERM", (signal) => {
  void shutdown(signal);
});

await app.listen({
  host: env.API_HOST,
  port: env.API_PORT,
});

import Fastify, { type FastifyInstance } from "fastify";

import type { AppServices } from "./appServices.js";
import { registerErrorHandler } from "./errors/errorHandler.js";
import { registerJwtAuthPlugin } from "./plugins/jwtAuthPlugin.js";
import { buildRequestIdOptions, registerRequestIdPlugin } from "./plugins/requestIdPlugin.js";
import { registerSensiblePlugin } from "./plugins/sensiblePlugin.js";
import { registerRoutes } from "./routes/registerRoutes.js";

export const requestBodyLimitBytes = 1_048_576;

export type BuildAppOptions = {
  jwtAudience: string;
  jwtIssuer: string;
  jwtSecret: string;
  logger?: boolean;
  nodeEnv: "development" | "test" | "production";
  services: AppServices;
};

export function buildApp(options: BuildAppOptions): FastifyInstance {
  const app = Fastify({
    bodyLimit: requestBodyLimitBytes,
    logger: options.logger ?? options.nodeEnv !== "test",
    ...buildRequestIdOptions(),
  });

  registerErrorHandler(app);
  registerSensiblePlugin(app);
  registerRequestIdPlugin(app);
  registerJwtAuthPlugin(app, {
    authService: options.services.authService,
    jwtAudience: options.jwtAudience,
    jwtIssuer: options.jwtIssuer,
    jwtSecret: options.jwtSecret,
  });
  registerRoutes(app, options.services, {
    enableDevelopmentAuthRoutes: options.nodeEnv === "development",
  });

  return app;
}

import Fastify, { type FastifyInstance } from "fastify";

import { registerHealthRoutes } from "../modules/health/health.routes.js";

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: true,
  });

  registerHealthRoutes(app);

  return app;
}

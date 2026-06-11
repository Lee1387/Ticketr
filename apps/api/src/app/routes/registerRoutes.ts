import type { FastifyInstance } from "fastify";

import { registerHealthRoutes } from "../../modules/health/health.routes.js";

export function registerRoutes(app: FastifyInstance): void {
  registerHealthRoutes(app);
}

import type { FastifyInstance } from "fastify";

import { registerHealthRoutes } from "../../modules/health/health.routes.js";
import { registerTicketRoutes } from "../../modules/tickets/tickets.routes.js";

export function registerRoutes(app: FastifyInstance): void {
  registerHealthRoutes(app);
  registerTicketRoutes(app);
}

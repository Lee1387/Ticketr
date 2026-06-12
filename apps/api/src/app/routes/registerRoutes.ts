import type { FastifyInstance } from "fastify";

import { registerHealthRoutes } from "../../modules/health/health.routes.js";
import { registerTicketRoutes } from "../../modules/tickets/tickets.routes.js";
import type { AppServices } from "../appServices.js";

export function registerRoutes(app: FastifyInstance, services: AppServices): void {
  registerHealthRoutes(app);
  registerTicketRoutes(app, services.ticketsService);
}

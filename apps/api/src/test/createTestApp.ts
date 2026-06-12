import type { FastifyInstance } from "fastify";

import { buildApp, type BuildAppOptions } from "../app/buildApp.js";
import { type OrganizationLookup, TicketsService } from "../modules/tickets/tickets.service.js";

const defaultOrganizationLookup: OrganizationLookup = {
  findById: (id) => Promise.resolve({ id }),
};

export function createTestApp(options: Partial<BuildAppOptions> = {}): FastifyInstance {
  return buildApp({
    services: {
      ticketsService:
        options.services?.ticketsService ?? new TicketsService(defaultOrganizationLookup),
    },
  });
}

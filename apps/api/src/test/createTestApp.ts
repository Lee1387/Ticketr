import type { FastifyInstance } from "fastify";

import { buildApp, type BuildAppOptions } from "../app/buildApp.js";
import {
  type OrganizationLookup,
  type TicketsRepositoryPort,
  TicketsService,
} from "../modules/tickets/tickets.service.js";

const defaultOrganizationLookup: OrganizationLookup = {
  findById: (id) => Promise.resolve({ id }),
};

const defaultTicket = {
  id: "55555555-5555-4555-8555-555555555555",
  organizationId: "6b4df69e-0950-4209-b79a-a5b5d251540f",
  subject: "Cannot access account",
  description: "The customer cannot sign in after resetting their password.",
  status: "open" as const,
  priority: "high" as const,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const defaultTicketsRepository: TicketsRepositoryPort = {
  create: (input) =>
    Promise.resolve({
      ...defaultTicket,
      organizationId: input.organizationId,
      subject: input.subject,
      description: input.description,
      priority: input.priority,
    }),
  findByOrganizationIdAndId: ({ id, organizationId }) =>
    Promise.resolve({
      ...defaultTicket,
      id,
      organizationId,
    }),
  listByOrganizationId: ({ organizationId }) =>
    Promise.resolve([
      {
        ...defaultTicket,
        organizationId,
      },
    ]),
};

export function createTestApp(options: Partial<BuildAppOptions> = {}): FastifyInstance {
  return buildApp({
    services: {
      ticketsService:
        options.services?.ticketsService ??
        new TicketsService(defaultOrganizationLookup, defaultTicketsRepository),
    },
  });
}

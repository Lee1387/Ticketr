import type { FastifyInstance } from "fastify";

import type { AppServices } from "../app/appServices.js";
import { buildApp, type BuildAppOptions } from "../app/buildApp.js";
import {
  type OrganizationsRepositoryPort,
  OrganizationsService,
} from "../modules/organizations/organizations.service.js";
import { type TicketsRepositoryPort, TicketsService } from "../modules/tickets/tickets.service.js";

type CreateTestAppOptions = {
  jwtSecret?: string;
  services?: Partial<AppServices>;
};

const defaultOrganization = {
  id: "6b4df69e-0950-4209-b79a-a5b5d251540f",
  name: "Acme Support",
  status: "active" as const,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const defaultOrganizationsRepository: OrganizationsRepositoryPort = {
  findById: (id) =>
    Promise.resolve({
      ...defaultOrganization,
      id,
    }),
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
  updateStatusByOrganizationIdAndId: ({ id, organizationId, status }) =>
    Promise.resolve({
      ...defaultTicket,
      id,
      organizationId,
      status,
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    }),
};

const defaultOrganizationsService = new OrganizationsService(defaultOrganizationsRepository);

export function createTestApp(options: CreateTestAppOptions = {}): FastifyInstance {
  const services: BuildAppOptions["services"] = {
    organizationsService: options.services?.organizationsService ?? defaultOrganizationsService,
    ticketsService:
      options.services?.ticketsService ??
      new TicketsService(defaultOrganizationsRepository, defaultTicketsRepository),
  };

  return buildApp({
    jwtSecret: options.jwtSecret ?? "test-jwt-secret-with-at-least-thirty-two-characters",
    services,
  });
}

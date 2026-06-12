import { vi } from "vitest";

import type { Ticket } from "../../service/tickets.service.models.js";
import type {
  OrganizationLookup,
  TicketsRepositoryPort,
} from "../../service/tickets.service.ports.js";

export const serviceTestOrganizationId = "6b4df69e-0950-4209-b79a-a5b5d251540f";

export const serviceTestCreateTicketInput = {
  subject: "Cannot access account",
  description: "The customer cannot sign in after resetting their password.",
  priority: "normal" as const,
};

export const serviceTestTicket: Ticket = {
  id: "55555555-5555-4555-8555-555555555555",
  organizationId: serviceTestOrganizationId,
  subject: serviceTestCreateTicketInput.subject,
  description: serviceTestCreateTicketInput.description,
  status: "open",
  priority: serviceTestCreateTicketInput.priority,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

export const existingOrganizationLookup: OrganizationLookup = {
  findById: (id) => Promise.resolve({ id }),
};

export const missingOrganizationLookup: OrganizationLookup = {
  findById: () => Promise.resolve(null),
};

export function createServiceTestTicketsRepository(
  overrides: Partial<TicketsRepositoryPort> = {},
): TicketsRepositoryPort {
  return {
    create: vi.fn(() => Promise.resolve(serviceTestTicket)),
    findByOrganizationIdAndId: vi.fn(() => Promise.resolve(null)),
    listByOrganizationId: vi.fn(() => Promise.resolve([])),
    updateStatusByOrganizationIdAndId: vi.fn(() => Promise.resolve(null)),
    ...overrides,
  };
}

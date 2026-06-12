import { vi } from "vitest";

import { createAuthHeaders } from "../../../test/authTestUtils.js";
import {
  type OrganizationLookup,
  type Ticket,
  type TicketsRepositoryPort,
} from "../tickets.service.types.js";

export const routeTestOrganizationId = "6b4df69e-0950-4209-b79a-a5b5d251540f";

export const routeTestTicketId = "55555555-5555-4555-8555-555555555555";

export const createRouteTestAuthHeaders = createAuthHeaders;

export const routeTestTicket: Ticket = {
  id: routeTestTicketId,
  organizationId: routeTestOrganizationId,
  subject: "Cannot access account",
  description: "The customer cannot sign in after resetting their password.",
  status: "open",
  priority: "high",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

export const routeTestTicketResponse = {
  id: routeTestTicketId,
  organizationId: routeTestOrganizationId,
  subject: "Cannot access account",
  description: "The customer cannot sign in after resetting their password.",
  status: "open",
  priority: "high",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

export const routeTestOrganizationLookup: OrganizationLookup = {
  findById: (id) => Promise.resolve({ id }),
};

export function createRouteTestTicketsRepository(
  overrides: Partial<TicketsRepositoryPort> = {},
): TicketsRepositoryPort {
  return {
    create: vi.fn(() => Promise.resolve(routeTestTicket)),
    findByOrganizationIdAndId: vi.fn(() => Promise.resolve(null)),
    listByOrganizationId: vi.fn(() => Promise.resolve([])),
    updateStatusByOrganizationIdAndId: vi.fn(() => Promise.resolve(null)),
    ...overrides,
  };
}

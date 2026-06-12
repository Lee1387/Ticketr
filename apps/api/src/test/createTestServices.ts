import type { AppServices } from "../app/appServices.js";
import { AuthService } from "../modules/auth/auth.service.js";
import { OrganizationAccessService } from "../modules/organizations/organizationAccess.service.js";
import {
  type OrganizationsRepositoryPort,
  OrganizationsService,
} from "../modules/organizations/organizations.service.js";
import { TicketsService } from "../modules/tickets/tickets.service.js";
import type { TicketsRepositoryPort } from "../modules/tickets/tickets.service.types.js";

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

const defaultOrganizationMembershipLookup = {
  findByOrganizationIdAndUserId: () => Promise.resolve({ role: "agent" as const }),
};

const defaultAuthenticatedUserLookup = {
  findByEmail: () =>
    Promise.resolve({
      id: "11111111-1111-4111-8111-111111111111",
      passwordHash: "test-password-hash",
      status: "active" as const,
    }),
  findById: () => Promise.resolve({ status: "active" as const }),
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
const defaultAuthService = new AuthService(defaultAuthenticatedUserLookup);
const defaultOrganizationAccessService = new OrganizationAccessService(
  defaultOrganizationMembershipLookup,
);

export function createTestServices(overrides: Partial<AppServices> = {}): AppServices {
  return {
    authService: overrides.authService ?? defaultAuthService,
    organizationAccessService:
      overrides.organizationAccessService ?? defaultOrganizationAccessService,
    organizationsService: overrides.organizationsService ?? defaultOrganizationsService,
    ticketsService:
      overrides.ticketsService ??
      new TicketsService(defaultOrganizationsRepository, defaultTicketsRepository),
  };
}

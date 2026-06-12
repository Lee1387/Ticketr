import { defaultTestOrganization } from "./organizations.fixture.js";

export const defaultTestTicket = {
  id: "55555555-5555-4555-8555-555555555555",
  organizationId: defaultTestOrganization.id,
  subject: "Cannot access account",
  description: "The customer cannot sign in after resetting their password.",
  status: "open" as const,
  priority: "high" as const,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

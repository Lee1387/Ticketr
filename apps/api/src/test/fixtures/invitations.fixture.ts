import { defaultTestOrganization } from "./organizations.fixture.js";
import { defaultTestUser } from "./users.fixture.js";

export const defaultTestInvitation = {
  acceptedAt: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  email: defaultTestUser.email,
  expiresAt: new Date("2026-01-08T00:00:00.000Z"),
  id: "22222222-2222-4222-8222-222222222222",
  organizationId: defaultTestOrganization.id,
  role: "agent" as const,
  status: "pending" as const,
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

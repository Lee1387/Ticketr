import { describe, expect, it } from "vitest";

import { invitationsTable } from "../../../../infrastructure/db/schema/invitations.js";
import {
  invitationRepositoryTestOrganizationId,
  invitationRepositoryTestOtherOrganizationId,
  setupInvitationsRepositoryTest,
} from "./invitations.repository.testUtils.js";

describe("InvitationsRepository list pending integration", () => {
  const context = setupInvitationsRepositoryTest();

  it("lists pending organization invitations newest first before the provided cursor", async () => {
    const repository = context.getRepository();

    await context
      .getTestDatabase()
      .connection.db.insert(invitationsTable)
      .values([
        {
          id: "11111111-1111-4111-8111-111111111111",
          organizationId: invitationRepositoryTestOrganizationId,
          email: "old@example.com",
          role: "agent",
          expiresAt: new Date("2030-01-01T00:00:00.000Z"),
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        {
          id: "22222222-2222-4222-8222-222222222222",
          organizationId: invitationRepositoryTestOrganizationId,
          email: "newest@example.com",
          role: "admin",
          expiresAt: new Date("2030-01-01T00:00:00.000Z"),
          createdAt: new Date("2026-01-03T00:00:00.000Z"),
          updatedAt: new Date("2026-01-03T00:00:00.000Z"),
        },
        {
          id: "33333333-3333-4333-8333-333333333333",
          organizationId: invitationRepositoryTestOrganizationId,
          email: "middle@example.com",
          role: "agent",
          expiresAt: new Date("2030-01-01T00:00:00.000Z"),
          createdAt: new Date("2026-01-02T00:00:00.000Z"),
          updatedAt: new Date("2026-01-02T00:00:00.000Z"),
        },
        {
          id: "88888888-8888-4888-8888-888888888888",
          organizationId: invitationRepositoryTestOtherOrganizationId,
          email: "other@example.com",
          role: "agent",
          expiresAt: new Date("2030-01-01T00:00:00.000Z"),
          createdAt: new Date("2026-01-02T12:00:00.000Z"),
          updatedAt: new Date("2026-01-02T12:00:00.000Z"),
        },
        {
          id: "99999999-9999-4999-8999-999999999999",
          organizationId: invitationRepositoryTestOrganizationId,
          email: "revoked@example.com",
          role: "agent",
          status: "revoked",
          expiresAt: new Date("2030-01-01T00:00:00.000Z"),
          createdAt: new Date("2026-01-02T12:00:00.000Z"),
          updatedAt: new Date("2026-01-02T12:00:00.000Z"),
        },
      ]);

    const invitations = await repository.listPendingByOrganizationId({
      organizationId: invitationRepositoryTestOrganizationId,
      limit: 2,
      createdBefore: new Date("2026-01-03T00:00:00.000Z"),
    });

    expect(invitations.map((invitation) => invitation.id)).toEqual([
      "33333333-3333-4333-8333-333333333333",
      "11111111-1111-4111-8111-111111111111",
    ]);
  });
});

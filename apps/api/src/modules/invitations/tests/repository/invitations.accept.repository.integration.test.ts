import { describe, expect, it } from "vitest";

import { organizationMembersTable } from "../../../../infrastructure/db/schema/organizationMembers.js";
import { usersTable } from "../../../../infrastructure/db/schema/users.js";
import {
  invitationRepositoryTestExpiresAt,
  invitationRepositoryTestOrganizationId,
  setupInvitationsRepositoryTest,
} from "./invitations.repository.testUtils.js";

describe("InvitationsRepository accept integration", () => {
  const context = setupInvitationsRepositoryTest();

  it("accepts a pending invitation once", async () => {
    const invitation = await context.getRepository().create({
      email: "agent@example.com",
      expiresAt: invitationRepositoryTestExpiresAt,
      organizationId: invitationRepositoryTestOrganizationId,
      role: "agent",
    });
    const acceptedAt = new Date("2030-01-02T00:00:00.000Z");

    await expect(
      context.getRepository().acceptPendingById({
        acceptedAt,
        id: invitation.id,
      }),
    ).resolves.toMatchObject({
      acceptedAt,
      id: invitation.id,
      status: "accepted",
    });

    await expect(
      context.getRepository().acceptPendingById({
        acceptedAt,
        id: invitation.id,
      }),
    ).resolves.toBeNull();
  });

  it("accepts a pending invitation and creates organization membership transactionally", async () => {
    const userId = "22222222-2222-4222-8222-222222222222";
    await context.getTestDatabase().connection.db.insert(usersTable).values({
      id: userId,
      email: "agent@example.com",
      name: "Support Agent",
      passwordHash: "test-password-hash",
      status: "active",
    });
    const invitation = await context.getRepository().create({
      email: "agent@example.com",
      expiresAt: invitationRepositoryTestExpiresAt,
      organizationId: invitationRepositoryTestOrganizationId,
      role: "admin",
    });
    const acceptedAt = new Date("2030-01-02T00:00:00.000Z");

    await expect(
      context.getAcceptanceRepository().acceptPendingByIdAndCreateMembership({
        acceptedAt,
        id: invitation.id,
        organizationId: invitationRepositoryTestOrganizationId,
        role: "admin",
        userId,
      }),
    ).resolves.toMatchObject({
      acceptedAt,
      id: invitation.id,
      status: "accepted",
    });

    await expect(
      context.getTestDatabase().connection.db.select().from(organizationMembersTable),
    ).resolves.toMatchObject([
      {
        organizationId: invitationRepositoryTestOrganizationId,
        role: "admin",
        userId,
      },
    ]);
  });
});

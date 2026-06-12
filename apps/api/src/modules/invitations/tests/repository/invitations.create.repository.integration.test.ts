import { describe, expect, it } from "vitest";

import {
  invitationRepositoryTestExpiresAt,
  invitationRepositoryTestOrganizationId,
  setupInvitationsRepositoryTest,
} from "./invitations.repository.testUtils.js";

describe("InvitationsRepository create/find integration", () => {
  const context = setupInvitationsRepositoryTest();

  it("creates a pending invitation", async () => {
    await expect(
      context.getRepository().create({
        email: "agent@example.com",
        expiresAt: invitationRepositoryTestExpiresAt,
        organizationId: invitationRepositoryTestOrganizationId,
        role: "agent",
      }),
    ).resolves.toMatchObject({
      email: "agent@example.com",
      organizationId: invitationRepositoryTestOrganizationId,
      role: "agent",
      status: "pending",
    });
  });

  it("finds a pending invitation by organization and email", async () => {
    await context.getRepository().create({
      email: "agent@example.com",
      expiresAt: invitationRepositoryTestExpiresAt,
      organizationId: invitationRepositoryTestOrganizationId,
      role: "admin",
    });

    await expect(
      context.getRepository().findPendingByOrganizationIdAndEmail({
        email: "agent@example.com",
        organizationId: invitationRepositoryTestOrganizationId,
      }),
    ).resolves.toMatchObject({
      email: "agent@example.com",
      role: "admin",
      status: "pending",
    });
  });

  it("returns null when no pending invitation exists for the organization and email", async () => {
    await expect(
      context.getRepository().findPendingByOrganizationIdAndEmail({
        email: "missing@example.com",
        organizationId: invitationRepositoryTestOrganizationId,
      }),
    ).resolves.toBeNull();
  });

  it("finds a pending invitation by id", async () => {
    const invitation = await context.getRepository().create({
      email: "agent@example.com",
      expiresAt: invitationRepositoryTestExpiresAt,
      organizationId: invitationRepositoryTestOrganizationId,
      role: "agent",
    });

    await expect(context.getRepository().findPendingById(invitation.id)).resolves.toMatchObject({
      id: invitation.id,
      status: "pending",
    });
  });
});

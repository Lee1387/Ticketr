import { describe, expect, it } from "vitest";

import {
  invitationRepositoryTestExpiresAt,
  invitationRepositoryTestOrganizationId,
  setupInvitationsRepositoryTest,
} from "./invitations.repository.testUtils.js";

describe("InvitationsRepository revoke integration", () => {
  const context = setupInvitationsRepositoryTest();

  it("revokes a pending invitation once", async () => {
    const invitation = await context.getRepository().create({
      email: "agent@example.com",
      expiresAt: invitationRepositoryTestExpiresAt,
      organizationId: invitationRepositoryTestOrganizationId,
      role: "agent",
    });

    await expect(context.getRepository().revokePendingById(invitation.id)).resolves.toMatchObject({
      id: invitation.id,
      status: "revoked",
    });

    await expect(context.getRepository().revokePendingById(invitation.id)).resolves.toBeNull();
  });
});

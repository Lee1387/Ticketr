import { describe, expect, it } from "vitest";

import {
  setupTicketsRepositoryTest,
  ticketsRepositoryTestOrganizationId,
  ticketsRepositoryTestOtherOrganizationId,
} from "./tickets.repository.testUtils.js";

describe("TicketsRepository read integration", () => {
  const context = setupTicketsRepositoryTest();

  it("finds a ticket scoped to an organization", async () => {
    const repository = context.getRepository();

    await context.createActiveOrganization();

    const ticket = await repository.create({
      organizationId: ticketsRepositoryTestOrganizationId,
      subject: "Cannot access account",
      description: "The customer cannot sign in after resetting their password.",
      priority: "high",
    });

    await expect(
      repository.findByOrganizationIdAndId({
        id: ticket.id,
        organizationId: ticketsRepositoryTestOrganizationId,
      }),
    ).resolves.toEqual(ticket);
  });

  it("returns null when a ticket does not belong to the organization", async () => {
    const repository = context.getRepository();

    await context.createActiveOrganizations();

    const ticket = await repository.create({
      organizationId: ticketsRepositoryTestOrganizationId,
      subject: "Cannot access account",
      description: "The customer cannot sign in after resetting their password.",
      priority: "high",
    });

    await expect(
      repository.findByOrganizationIdAndId({
        id: ticket.id,
        organizationId: ticketsRepositoryTestOtherOrganizationId,
      }),
    ).resolves.toBeNull();
  });
});

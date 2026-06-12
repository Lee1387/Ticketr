import { describe, expect, it } from "vitest";

import {
  setupTicketsRepositoryTest,
  ticketsRepositoryTestOrganizationId,
  ticketsRepositoryTestOtherOrganizationId,
} from "./tickets.repository.testUtils.js";

describe("TicketsRepository status integration", () => {
  const context = setupTicketsRepositoryTest();

  it("updates a ticket status scoped to an organization", async () => {
    const repository = context.getRepository();

    await context.createActiveOrganizations();

    const ticket = await repository.create({
      organizationId: ticketsRepositoryTestOrganizationId,
      subject: "Cannot access account",
      description: "The customer cannot sign in after resetting their password.",
      priority: "high",
    });

    await expect(
      repository.updateStatusByOrganizationIdAndId({
        currentStatus: "open",
        id: ticket.id,
        organizationId: ticketsRepositoryTestOtherOrganizationId,
        status: "pending",
      }),
    ).resolves.toBeNull();

    const updatedTicket = await repository.updateStatusByOrganizationIdAndId({
      currentStatus: "open",
      id: ticket.id,
      organizationId: ticketsRepositoryTestOrganizationId,
      status: "pending",
    });

    expect(updatedTicket).toMatchObject({
      id: ticket.id,
      organizationId: ticketsRepositoryTestOrganizationId,
      status: "pending",
    });
    expect(updatedTicket?.updatedAt.getTime()).toBeGreaterThanOrEqual(ticket.updatedAt.getTime());
  });

  it("does not update a ticket status when the current status changed", async () => {
    const repository = context.getRepository();

    await context.createActiveOrganization();

    const ticket = await repository.create({
      organizationId: ticketsRepositoryTestOrganizationId,
      subject: "Cannot access account",
      description: "The customer cannot sign in after resetting their password.",
      priority: "high",
    });

    await expect(
      repository.updateStatusByOrganizationIdAndId({
        currentStatus: "pending",
        id: ticket.id,
        organizationId: ticketsRepositoryTestOrganizationId,
        status: "resolved",
      }),
    ).resolves.toBeNull();
  });
});

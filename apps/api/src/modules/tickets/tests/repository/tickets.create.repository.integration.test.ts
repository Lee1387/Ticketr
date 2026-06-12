import { describe, expect, it } from "vitest";

import {
  setupTicketsRepositoryTest,
  ticketsRepositoryTestOrganizationId,
} from "./tickets.repository.testUtils.js";

describe("TicketsRepository create integration", () => {
  const context = setupTicketsRepositoryTest();

  it("creates a ticket scoped to an organization", async () => {
    const repository = context.getRepository();

    await context.createActiveOrganization();

    const ticket = await repository.create({
      organizationId: ticketsRepositoryTestOrganizationId,
      subject: "Cannot access account",
      description: "The customer cannot sign in after resetting their password.",
      priority: "high",
    });

    expect(ticket).toMatchObject({
      organizationId: ticketsRepositoryTestOrganizationId,
      subject: "Cannot access account",
      description: "The customer cannot sign in after resetting their password.",
      status: "open",
      priority: "high",
    });
  });
});

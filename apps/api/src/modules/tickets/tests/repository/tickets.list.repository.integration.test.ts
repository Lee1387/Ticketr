import { describe, expect, it } from "vitest";

import { ticketsTable } from "../../../../infrastructure/db/schema/tickets.js";
import {
  setupTicketsRepositoryTest,
  ticketsRepositoryTestOrganizationId,
  ticketsRepositoryTestOtherOrganizationId,
} from "./tickets.repository.testUtils.js";

describe("TicketsRepository list integration", () => {
  const context = setupTicketsRepositoryTest();

  it("lists organization tickets newest first before the provided cursor", async () => {
    const repository = context.getRepository();

    await context.createActiveOrganizations();
    await context
      .getTestDatabase()
      .connection.db.insert(ticketsTable)
      .values([
        {
          id: "11111111-1111-4111-8111-111111111111",
          organizationId: ticketsRepositoryTestOrganizationId,
          subject: "Old ticket",
          description: "Older matching ticket.",
          priority: "normal",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        {
          id: "22222222-2222-4222-8222-222222222222",
          organizationId: ticketsRepositoryTestOrganizationId,
          subject: "Newest ticket",
          description: "This ticket is after the cursor.",
          priority: "high",
          createdAt: new Date("2026-01-03T00:00:00.000Z"),
          updatedAt: new Date("2026-01-03T00:00:00.000Z"),
        },
        {
          id: "33333333-3333-4333-8333-333333333333",
          organizationId: ticketsRepositoryTestOrganizationId,
          subject: "Middle ticket",
          description: "Newer matching ticket.",
          priority: "urgent",
          createdAt: new Date("2026-01-02T00:00:00.000Z"),
          updatedAt: new Date("2026-01-02T00:00:00.000Z"),
        },
        {
          id: "88888888-8888-4888-8888-888888888888",
          organizationId: ticketsRepositoryTestOtherOrganizationId,
          subject: "Other organization ticket",
          description: "This must not be returned.",
          priority: "normal",
          createdAt: new Date("2026-01-02T12:00:00.000Z"),
          updatedAt: new Date("2026-01-02T12:00:00.000Z"),
        },
      ]);

    const tickets = await repository.listByOrganizationId({
      organizationId: ticketsRepositoryTestOrganizationId,
      limit: 2,
      createdBefore: new Date("2026-01-03T00:00:00.000Z"),
    });

    expect(tickets.map((ticket) => ticket.id)).toEqual([
      "33333333-3333-4333-8333-333333333333",
      "11111111-1111-4111-8111-111111111111",
    ]);
  });
});

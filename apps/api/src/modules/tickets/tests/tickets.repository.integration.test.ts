import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { organizationsTable } from "../../../infrastructure/db/schema/organizations.js";
import { ticketsTable } from "../../../infrastructure/db/schema/tickets.js";
import { createTestDatabase, type TestDatabase } from "../../../test/createTestDatabase.js";
import { TicketsRepository } from "../tickets.repository.js";

describe("TicketsRepository integration", () => {
  let testDatabase: TestDatabase | undefined;

  beforeAll(async () => {
    testDatabase = await createTestDatabase();
  }, 120_000);

  beforeEach(async () => {
    const database = getTestDatabase();
    await database.connection.db.delete(ticketsTable);
    await database.connection.db.delete(organizationsTable);
  });

  afterAll(async () => {
    await testDatabase?.stop();
    testDatabase = undefined;
  }, 30_000);

  function getTestDatabase(): TestDatabase {
    if (testDatabase === undefined) {
      throw new Error("Test database was not initialized.");
    }

    return testDatabase;
  }

  it("creates and finds a ticket scoped to an organization", async () => {
    const database = getTestDatabase();
    const repository = new TicketsRepository(database.connection.db);
    const organizationId = "44444444-4444-4444-8444-444444444444";

    await database.connection.db.insert(organizationsTable).values({
      id: organizationId,
      name: "Acme Support",
      status: "active",
    });

    const ticket = await repository.create({
      organizationId,
      subject: "Cannot access account",
      description: "The customer cannot sign in after resetting their password.",
      priority: "high",
    });

    expect(ticket).toMatchObject({
      organizationId,
      subject: "Cannot access account",
      description: "The customer cannot sign in after resetting their password.",
      status: "open",
      priority: "high",
    });

    await expect(
      repository.findByOrganizationIdAndId({
        id: ticket.id,
        organizationId,
      }),
    ).resolves.toEqual(ticket);
  });

  it("returns null when a ticket does not belong to the organization", async () => {
    const database = getTestDatabase();
    const repository = new TicketsRepository(database.connection.db);
    const organizationId = "44444444-4444-4444-8444-444444444444";
    const otherOrganizationId = "77777777-7777-4777-8777-777777777777";

    await database.connection.db.insert(organizationsTable).values([
      {
        id: organizationId,
        name: "Acme Support",
        status: "active",
      },
      {
        id: otherOrganizationId,
        name: "Northwind Support",
        status: "active",
      },
    ]);

    const ticket = await repository.create({
      organizationId,
      subject: "Cannot access account",
      description: "The customer cannot sign in after resetting their password.",
      priority: "high",
    });

    await expect(
      repository.findByOrganizationIdAndId({
        id: ticket.id,
        organizationId: otherOrganizationId,
      }),
    ).resolves.toBeNull();
  });

  it("updates a ticket status scoped to an organization", async () => {
    const database = getTestDatabase();
    const repository = new TicketsRepository(database.connection.db);
    const organizationId = "44444444-4444-4444-8444-444444444444";
    const otherOrganizationId = "77777777-7777-4777-8777-777777777777";

    await database.connection.db.insert(organizationsTable).values([
      {
        id: organizationId,
        name: "Acme Support",
        status: "active",
      },
      {
        id: otherOrganizationId,
        name: "Northwind Support",
        status: "active",
      },
    ]);

    const ticket = await repository.create({
      organizationId,
      subject: "Cannot access account",
      description: "The customer cannot sign in after resetting their password.",
      priority: "high",
    });

    await expect(
      repository.updateStatusByOrganizationIdAndId({
        currentStatus: "open",
        id: ticket.id,
        organizationId: otherOrganizationId,
        status: "pending",
      }),
    ).resolves.toBeNull();

    const updatedTicket = await repository.updateStatusByOrganizationIdAndId({
      currentStatus: "open",
      id: ticket.id,
      organizationId,
      status: "pending",
    });

    expect(updatedTicket).toMatchObject({
      id: ticket.id,
      organizationId,
      status: "pending",
    });
    expect(updatedTicket?.updatedAt.getTime()).toBeGreaterThanOrEqual(ticket.updatedAt.getTime());
  });

  it("does not update a ticket status when the current status changed", async () => {
    const database = getTestDatabase();
    const repository = new TicketsRepository(database.connection.db);
    const organizationId = "44444444-4444-4444-8444-444444444444";

    await database.connection.db.insert(organizationsTable).values({
      id: organizationId,
      name: "Acme Support",
      status: "active",
    });

    const ticket = await repository.create({
      organizationId,
      subject: "Cannot access account",
      description: "The customer cannot sign in after resetting their password.",
      priority: "high",
    });

    await expect(
      repository.updateStatusByOrganizationIdAndId({
        currentStatus: "pending",
        id: ticket.id,
        organizationId,
        status: "resolved",
      }),
    ).resolves.toBeNull();
  });

  it("lists organization tickets newest first before the provided cursor", async () => {
    const database = getTestDatabase();
    const repository = new TicketsRepository(database.connection.db);
    const organizationId = "44444444-4444-4444-8444-444444444444";
    const otherOrganizationId = "77777777-7777-4777-8777-777777777777";

    await database.connection.db.insert(organizationsTable).values([
      {
        id: organizationId,
        name: "Acme Support",
        status: "active",
      },
      {
        id: otherOrganizationId,
        name: "Northwind Support",
        status: "active",
      },
    ]);

    await database.connection.db.insert(ticketsTable).values([
      {
        id: "11111111-1111-4111-8111-111111111111",
        organizationId,
        subject: "Old ticket",
        description: "Older matching ticket.",
        priority: "normal",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
      {
        id: "22222222-2222-4222-8222-222222222222",
        organizationId,
        subject: "Newest ticket",
        description: "This ticket is after the cursor.",
        priority: "high",
        createdAt: new Date("2026-01-03T00:00:00.000Z"),
        updatedAt: new Date("2026-01-03T00:00:00.000Z"),
      },
      {
        id: "33333333-3333-4333-8333-333333333333",
        organizationId,
        subject: "Middle ticket",
        description: "Newer matching ticket.",
        priority: "urgent",
        createdAt: new Date("2026-01-02T00:00:00.000Z"),
        updatedAt: new Date("2026-01-02T00:00:00.000Z"),
      },
      {
        id: "88888888-8888-4888-8888-888888888888",
        organizationId: otherOrganizationId,
        subject: "Other organization ticket",
        description: "This must not be returned.",
        priority: "normal",
        createdAt: new Date("2026-01-02T12:00:00.000Z"),
        updatedAt: new Date("2026-01-02T12:00:00.000Z"),
      },
    ]);

    const tickets = await repository.listByOrganizationId({
      organizationId,
      limit: 2,
      createdBefore: new Date("2026-01-03T00:00:00.000Z"),
    });

    expect(tickets.map((ticket) => ticket.id)).toEqual([
      "33333333-3333-4333-8333-333333333333",
      "11111111-1111-4111-8111-111111111111",
    ]);
  });
});

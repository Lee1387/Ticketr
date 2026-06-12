import { afterAll, beforeAll, beforeEach } from "vitest";

import { organizationsTable } from "../../../../infrastructure/db/schema/organizations.js";
import { ticketsTable } from "../../../../infrastructure/db/schema/tickets.js";
import { createTestDatabase, type TestDatabase } from "../../../../test/createTestDatabase.js";
import { TicketsRepository } from "../../persistence/tickets.repository.js";

export const ticketsRepositoryTestOrganizationId = "44444444-4444-4444-8444-444444444444";
export const ticketsRepositoryTestOtherOrganizationId = "77777777-7777-4777-8777-777777777777";

export type TicketsRepositoryTestContext = {
  createActiveOrganization: (id?: string) => Promise<void>;
  createActiveOrganizations: () => Promise<void>;
  getRepository: () => TicketsRepository;
  getTestDatabase: () => TestDatabase;
};

export function setupTicketsRepositoryTest(): TicketsRepositoryTestContext {
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

  function getRepository(): TicketsRepository {
    return new TicketsRepository(getTestDatabase().connection.db);
  }

  async function createActiveOrganization(
    id: string = ticketsRepositoryTestOrganizationId,
  ): Promise<void> {
    await getTestDatabase().connection.db.insert(organizationsTable).values({
      id,
      name: "Acme Support",
      status: "active",
    });
  }

  async function createActiveOrganizations(): Promise<void> {
    await getTestDatabase()
      .connection.db.insert(organizationsTable)
      .values([
        {
          id: ticketsRepositoryTestOrganizationId,
          name: "Acme Support",
          status: "active",
        },
        {
          id: ticketsRepositoryTestOtherOrganizationId,
          name: "Northwind Support",
          status: "active",
        },
      ]);
  }

  return {
    createActiveOrganization,
    createActiveOrganizations,
    getRepository,
    getTestDatabase,
  };
}

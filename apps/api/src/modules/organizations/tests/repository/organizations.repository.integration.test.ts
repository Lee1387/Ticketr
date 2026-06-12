import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { organizationsTable } from "../../../../infrastructure/db/schema/organizations.js";
import { createTestDatabase, type TestDatabase } from "../../../../test/createTestDatabase.js";
import { OrganizationsRepository } from "../../persistence/organizations.repository.js";

describe("OrganizationsRepository integration", () => {
  let testDatabase: TestDatabase | undefined;

  beforeAll(async () => {
    testDatabase = await createTestDatabase();
  }, 120_000);

  afterAll(async () => {
    await testDatabase?.stop();
  }, 30_000);

  function getRepository(): OrganizationsRepository {
    if (testDatabase === undefined) {
      throw new Error("Test database was not initialized.");
    }

    return new OrganizationsRepository(testDatabase.connection.db);
  }

  it("finds an organization by id", async () => {
    if (testDatabase === undefined) {
      throw new Error("Test database was not initialized.");
    }

    const organizationId = "22222222-2222-4222-8222-222222222222";

    await testDatabase.connection.db.insert(organizationsTable).values({
      id: organizationId,
      name: "Acme Support",
      status: "active",
    });

    await expect(getRepository().findById(organizationId)).resolves.toMatchObject({
      id: organizationId,
      name: "Acme Support",
      status: "active",
    });
  });

  it("returns null for a missing organization", async () => {
    await expect(
      getRepository().findById("33333333-3333-4333-8333-333333333333"),
    ).resolves.toBeNull();
  });
});

import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { usersTable } from "../../../../infrastructure/db/schema/users.js";
import { createTestDatabase, type TestDatabase } from "../../../../test/createTestDatabase.js";
import { UsersRepository } from "../../persistence/users.repository.js";

describe("UsersRepository integration", () => {
  const testPasswordHash = "test-password-hash";

  let testDatabase: TestDatabase | undefined;

  beforeAll(async () => {
    testDatabase = await createTestDatabase();
  }, 120_000);

  beforeEach(async () => {
    await getTestDatabase().connection.db.delete(usersTable);
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

  function getRepository(): UsersRepository {
    return new UsersRepository(getTestDatabase().connection.db);
  }

  it("finds a user by id", async () => {
    const userId = "11111111-1111-4111-8111-111111111111";

    await getTestDatabase().connection.db.insert(usersTable).values({
      id: userId,
      email: "alex@example.com",
      name: "Alex Lee",
      passwordHash: testPasswordHash,
      status: "active",
    });

    await expect(getRepository().findById(userId)).resolves.toMatchObject({
      id: userId,
      email: "alex@example.com",
      name: "Alex Lee",
      passwordHash: testPasswordHash,
      status: "active",
    });
  });

  it("finds a user by email", async () => {
    const userId = "22222222-2222-4222-8222-222222222222";

    await getTestDatabase().connection.db.insert(usersTable).values({
      id: userId,
      email: "support@example.com",
      name: "Support Agent",
      passwordHash: testPasswordHash,
      status: "active",
    });

    await expect(getRepository().findByEmail("support@example.com")).resolves.toMatchObject({
      id: userId,
      email: "support@example.com",
      passwordHash: testPasswordHash,
    });
  });

  it("returns null for missing users", async () => {
    await expect(
      getRepository().findById("33333333-3333-4333-8333-333333333333"),
    ).resolves.toBeNull();
    await expect(getRepository().findByEmail("missing@example.com")).resolves.toBeNull();
  });
});

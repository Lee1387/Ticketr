import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { organizationMembersTable } from "../../src/infrastructure/db/schema/organizationMembers.js";
import { organizationsTable } from "../../src/infrastructure/db/schema/organizations.js";
import { usersTable } from "../../src/infrastructure/db/schema/users.js";
import { createTestDatabase, type TestDatabase } from "../../src/test/createTestDatabase.js";
import { seedDevDatabase } from "../helpers/seed/seedDevData.js";

describe("seedDevDatabase integration", () => {
  let testDatabase: TestDatabase | undefined;

  beforeAll(async () => {
    testDatabase = await createTestDatabase();
  }, 120_000);

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

  it("seeds local development data idempotently", async () => {
    const db = getTestDatabase().connection.db;

    await seedDevDatabase(db);
    await seedDevDatabase(db);

    const users = await db.select().from(usersTable);
    const organizations = await db.select().from(organizationsTable);
    const memberships = await db.select().from(organizationMembersTable);

    expect(users).toHaveLength(2);
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: "admin@ticketr.local",
          id: "11111111-1111-4111-8111-111111111111",
          status: "active",
        }),
        expect.objectContaining({
          email: "smoke-member@ticketr.local",
          id: "22222222-2222-4222-8222-222222222222",
          status: "active",
        }),
      ]),
    );
    expect(organizations).toMatchObject([
      {
        id: "6b4df69e-0950-4209-b79a-a5b5d251540f",
        name: "Acme Support",
        status: "active",
      },
    ]);
    expect(memberships).toHaveLength(2);
    expect(memberships).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          organizationId: "6b4df69e-0950-4209-b79a-a5b5d251540f",
          role: "admin",
          status: "active",
          userId: "11111111-1111-4111-8111-111111111111",
        }),
        expect.objectContaining({
          organizationId: "6b4df69e-0950-4209-b79a-a5b5d251540f",
          role: "agent",
          status: "active",
          userId: "22222222-2222-4222-8222-222222222222",
        }),
      ]),
    );
  });
});

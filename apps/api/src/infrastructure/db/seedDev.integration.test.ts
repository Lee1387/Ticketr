import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { organizationMembersTable } from "./schema/organizationMembers.js";
import { organizationsTable } from "./schema/organizations.js";
import { usersTable } from "./schema/users.js";
import { seedDevDatabase } from "./seedDevData.js";
import { createTestDatabase, type TestDatabase } from "../../test/createTestDatabase.js";

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

    expect(users).toMatchObject([
      {
        email: "agent@ticketr.local",
        id: "11111111-1111-4111-8111-111111111111",
        status: "active",
      },
    ]);
    expect(organizations).toMatchObject([
      {
        id: "6b4df69e-0950-4209-b79a-a5b5d251540f",
        name: "Acme Support",
        status: "active",
      },
    ]);
    expect(memberships).toMatchObject([
      {
        organizationId: "6b4df69e-0950-4209-b79a-a5b5d251540f",
        role: "agent",
        userId: "11111111-1111-4111-8111-111111111111",
      },
    ]);
  });
});

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { organizationMembersTable } from "../../../../infrastructure/db/schema/organizationMembers.js";
import { organizationsTable } from "../../../../infrastructure/db/schema/organizations.js";
import { usersTable } from "../../../../infrastructure/db/schema/users.js";
import { createTestDatabase, type TestDatabase } from "../../../../test/createTestDatabase.js";
import {
  getOrganizationMembersRepository,
  getOrganizationMembersTestDatabase,
} from "./organizationMembers.repository.testUtils.js";

describe("OrganizationMembersRepository list integration", () => {
  let testDatabase: TestDatabase | undefined;

  beforeAll(async () => {
    testDatabase = await createTestDatabase();
  }, 120_000);

  afterAll(async () => {
    await testDatabase?.stop();
  }, 30_000);

  it("lists organization members before a cursor", async () => {
    const database = getOrganizationMembersTestDatabase(testDatabase);
    const organizationId = "44444444-4444-4444-8444-444444444444";
    const otherOrganizationId = "55555555-5555-4555-8555-555555555555";
    const olderUserId = "66666666-6666-4666-8666-666666666666";
    const newerUserId = "77777777-7777-4777-8777-777777777777";
    const otherUserId = "88888888-8888-4888-8888-888888888888";

    await database.connection.db.insert(organizationsTable).values([
      {
        id: organizationId,
        name: "Globex Support",
        status: "active",
      },
      {
        id: otherOrganizationId,
        name: "Other Support",
        status: "active",
      },
    ]);

    await database.connection.db.insert(usersTable).values([
      {
        id: olderUserId,
        email: "older-agent@example.com",
        name: "Older Agent",
        passwordHash: "test-password-hash",
        status: "active",
      },
      {
        id: newerUserId,
        email: "newer-agent@example.com",
        name: "Newer Agent",
        passwordHash: "test-password-hash",
        status: "active",
      },
      {
        id: otherUserId,
        email: "other-agent@example.com",
        name: "Other Agent",
        passwordHash: "test-password-hash",
        status: "active",
      },
    ]);

    await database.connection.db.insert(organizationMembersTable).values([
      {
        organizationId,
        role: "agent",
        userId: olderUserId,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      },
      {
        organizationId,
        role: "admin",
        userId: newerUserId,
        createdAt: new Date("2026-01-02T00:00:00.000Z"),
      },
      {
        organizationId: otherOrganizationId,
        role: "agent",
        userId: otherUserId,
        createdAt: new Date("2026-01-03T00:00:00.000Z"),
      },
    ]);

    await expect(
      getOrganizationMembersRepository(testDatabase).listByOrganizationId({
        organizationId,
        createdBefore: new Date("2026-01-03T00:00:00.000Z"),
        limit: 10,
      }),
    ).resolves.toEqual([
      {
        createdAt: new Date("2026-01-02T00:00:00.000Z"),
        email: "newer-agent@example.com",
        name: "Newer Agent",
        role: "admin",
        status: "active",
        userId: newerUserId,
      },
      {
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        email: "older-agent@example.com",
        name: "Older Agent",
        role: "agent",
        status: "active",
        userId: olderUserId,
      },
    ]);
  });
});

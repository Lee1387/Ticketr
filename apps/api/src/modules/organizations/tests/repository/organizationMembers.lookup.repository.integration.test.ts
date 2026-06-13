import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { organizationMembersTable } from "../../../../infrastructure/db/schema/organizationMembers.js";
import { organizationsTable } from "../../../../infrastructure/db/schema/organizations.js";
import { usersTable } from "../../../../infrastructure/db/schema/users.js";
import { createTestDatabase, type TestDatabase } from "../../../../test/createTestDatabase.js";
import {
  getOrganizationMembershipsRepository,
  getOrganizationMembersTestDatabase,
} from "./organizationMembers.repository.testUtils.js";

describe("OrganizationMembershipsRepository integration", () => {
  let testDatabase: TestDatabase | undefined;

  beforeAll(async () => {
    testDatabase = await createTestDatabase();
  }, 120_000);

  afterAll(async () => {
    await testDatabase?.stop();
  }, 30_000);

  it("finds an organization member by organization and user", async () => {
    const database = getOrganizationMembersTestDatabase(testDatabase);
    const organizationId = "22222222-2222-4222-8222-222222222222";
    const userId = "11111111-1111-4111-8111-111111111111";

    await database.connection.db.insert(organizationsTable).values({
      id: organizationId,
      name: "Acme Support",
      status: "active",
    });

    await database.connection.db.insert(usersTable).values({
      id: userId,
      email: "agent@example.com",
      name: "Support Agent",
      passwordHash: "test-password-hash",
      status: "active",
    });

    await database.connection.db.insert(organizationMembersTable).values({
      organizationId,
      role: "agent",
      userId,
    });

    await expect(
      getOrganizationMembershipsRepository(testDatabase).findByOrganizationIdAndUserId({
        organizationId,
        userId,
      }),
    ).resolves.toMatchObject({
      membershipStatus: "active",
      organizationId,
      role: "agent",
      userId,
    });
  });

  it("returns null when the user is not a member of the organization", async () => {
    await expect(
      getOrganizationMembershipsRepository(testDatabase).findByOrganizationIdAndUserId({
        organizationId: "33333333-3333-4333-8333-333333333333",
        userId: "11111111-1111-4111-8111-111111111111",
      }),
    ).resolves.toBeNull();
  });
});

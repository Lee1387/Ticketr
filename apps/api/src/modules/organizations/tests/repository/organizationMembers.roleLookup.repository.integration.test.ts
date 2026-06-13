import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { organizationMembersTable } from "../../../../infrastructure/db/schema/organizationMembers.js";
import { organizationsTable } from "../../../../infrastructure/db/schema/organizations.js";
import { usersTable } from "../../../../infrastructure/db/schema/users.js";
import { createTestDatabase, type TestDatabase } from "../../../../test/createTestDatabase.js";
import {
  getOrganizationMemberRolesRepository,
  getOrganizationMembersTestDatabase,
} from "./organizationMembers.repository.testUtils.js";

describe("OrganizationMemberRolesRepository role lookup integration", () => {
  let testDatabase: TestDatabase | undefined;

  beforeAll(async () => {
    testDatabase = await createTestDatabase();
  }, 120_000);

  afterAll(async () => {
    await testDatabase?.stop();
  }, 30_000);

  it("finds a member role by organization and user", async () => {
    const database = getOrganizationMembersTestDatabase(testDatabase);
    const organizationId = "99999999-9999-4999-8999-999999999999";
    const userId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

    await database.connection.db.insert(organizationsTable).values({
      id: organizationId,
      name: "Role Lookup Support",
      status: "active",
    });

    await database.connection.db.insert(usersTable).values({
      id: userId,
      email: "role-lookup-agent@example.com",
      name: "Role Lookup Agent",
      passwordHash: "test-password-hash",
      status: "active",
    });

    await database.connection.db.insert(organizationMembersTable).values({
      organizationId,
      role: "admin",
      userId,
    });

    await expect(
      getOrganizationMemberRolesRepository(testDatabase).findRoleByOrganizationIdAndUserId({
        organizationId,
        userId,
      }),
    ).resolves.toEqual({
      membershipStatus: "active",
      role: "admin",
    });
  });
});

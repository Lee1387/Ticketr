import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { organizationMembersTable } from "../../../../infrastructure/db/schema/organizationMembers.js";
import { organizationsTable } from "../../../../infrastructure/db/schema/organizations.js";
import { usersTable } from "../../../../infrastructure/db/schema/users.js";
import { createTestDatabase, type TestDatabase } from "../../../../test/createTestDatabase.js";
import {
  getOrganizationMembersRepository,
  getOrganizationMembersTestDatabase,
} from "./organizationMembers.repository.testUtils.js";

describe("OrganizationMembersRepository role integration", () => {
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
      getOrganizationMembersRepository(testDatabase).findRoleByOrganizationIdAndUserId({
        organizationId,
        userId,
      }),
    ).resolves.toEqual({
      role: "admin",
    });
  });

  it("updates a member role when the current role still matches", async () => {
    const database = getOrganizationMembersTestDatabase(testDatabase);
    const organizationId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
    const userId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

    await database.connection.db.insert(organizationsTable).values({
      id: organizationId,
      name: "Role Update Support",
      status: "active",
    });

    await database.connection.db.insert(usersTable).values({
      id: userId,
      email: "role-update-agent@example.com",
      name: "Role Update Agent",
      passwordHash: "test-password-hash",
      status: "active",
    });

    await database.connection.db.insert(organizationMembersTable).values({
      organizationId,
      role: "agent",
      userId,
    });

    await expect(
      getOrganizationMembersRepository(testDatabase).updateRoleByOrganizationIdAndUserId({
        currentRole: "agent",
        organizationId,
        role: "admin",
        userId,
      }),
    ).resolves.toEqual({
      organizationId,
      role: "admin",
      userId,
    });
  });

  it("returns null when updating a role changed by another write", async () => {
    const database = getOrganizationMembersTestDatabase(testDatabase);
    const organizationId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
    const userId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

    await database.connection.db.insert(organizationsTable).values({
      id: organizationId,
      name: "Role Conflict Support",
      status: "active",
    });

    await database.connection.db.insert(usersTable).values({
      id: userId,
      email: "role-conflict-agent@example.com",
      name: "Role Conflict Agent",
      passwordHash: "test-password-hash",
      status: "active",
    });

    await database.connection.db.insert(organizationMembersTable).values({
      organizationId,
      role: "admin",
      userId,
    });

    await expect(
      getOrganizationMembersRepository(testDatabase).updateRoleByOrganizationIdAndUserId({
        currentRole: "agent",
        organizationId,
        role: "admin",
        userId,
      }),
    ).resolves.toBeNull();
  });
});

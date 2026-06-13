import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { organizationMembersTable } from "../../../../infrastructure/db/schema/organizationMembers.js";
import { organizationsTable } from "../../../../infrastructure/db/schema/organizations.js";
import { usersTable } from "../../../../infrastructure/db/schema/users.js";
import { createTestDatabase, type TestDatabase } from "../../../../test/createTestDatabase.js";
import {
  getOrganizationMemberRolesRepository,
  getOrganizationMembersTestDatabase,
} from "./organizationMembers.repository.testUtils.js";

describe("OrganizationMemberRolesRepository role update integration", () => {
  let testDatabase: TestDatabase | undefined;

  beforeAll(async () => {
    testDatabase = await createTestDatabase();
  }, 120_000);

  afterAll(async () => {
    await testDatabase?.stop();
  }, 30_000);

  it("updates a member role when the current role and status still match", async () => {
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
      getOrganizationMemberRolesRepository(testDatabase).updateRoleByOrganizationIdAndUserId({
        currentRole: "agent",
        currentStatus: "active",
        organizationId,
        role: "admin",
        userId,
      }),
    ).resolves.toEqual({
      membershipStatus: "active",
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
      getOrganizationMemberRolesRepository(testDatabase).updateRoleByOrganizationIdAndUserId({
        currentRole: "agent",
        currentStatus: "active",
        organizationId,
        role: "admin",
        userId,
      }),
    ).resolves.toBeNull();
  });

  it("returns null when updating a deactivated member role", async () => {
    const database = getOrganizationMembersTestDatabase(testDatabase);
    const organizationId = "abababab-abab-4aba-8aba-abababababab";
    const userId = "bcbcbcbc-bcbc-4bcb-8bcb-bcbcbcbcbcbc";

    await database.connection.db.insert(organizationsTable).values({
      id: organizationId,
      name: "Role Status Guard Support",
      status: "active",
    });

    await database.connection.db.insert(usersTable).values({
      id: userId,
      email: "role-status-guard-agent@example.com",
      name: "Role Status Guard Agent",
      passwordHash: "test-password-hash",
      status: "active",
    });

    await database.connection.db.insert(organizationMembersTable).values({
      organizationId,
      role: "agent",
      status: "deactivated",
      userId,
    });

    await expect(
      getOrganizationMemberRolesRepository(testDatabase).updateRoleByOrganizationIdAndUserId({
        currentRole: "agent",
        currentStatus: "active",
        organizationId,
        role: "admin",
        userId,
      }),
    ).resolves.toBeNull();
  });
});

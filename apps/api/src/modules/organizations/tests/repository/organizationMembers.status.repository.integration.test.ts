import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { organizationMembersTable } from "../../../../infrastructure/db/schema/organizationMembers.js";
import { organizationsTable } from "../../../../infrastructure/db/schema/organizations.js";
import { usersTable } from "../../../../infrastructure/db/schema/users.js";
import { createTestDatabase, type TestDatabase } from "../../../../test/createTestDatabase.js";
import {
  getOrganizationMemberStatusesRepository,
  getOrganizationMembersTestDatabase,
} from "./organizationMembers.repository.testUtils.js";

describe("OrganizationMemberStatusesRepository integration", () => {
  let testDatabase: TestDatabase | undefined;

  beforeAll(async () => {
    testDatabase = await createTestDatabase();
  }, 120_000);

  afterAll(async () => {
    await testDatabase?.stop();
  }, 30_000);

  it("updates a member status when the current status still matches", async () => {
    const database = getOrganizationMembersTestDatabase(testDatabase);
    const organizationId = "12121212-1212-4212-8212-121212121212";
    const userId = "13131313-1313-4313-8313-131313131313";

    await database.connection.db.insert(organizationsTable).values({
      id: organizationId,
      name: "Status Update Support",
      status: "active",
    });

    await database.connection.db.insert(usersTable).values({
      id: userId,
      email: "status-update-agent@example.com",
      name: "Status Update Agent",
      passwordHash: "test-password-hash",
      status: "active",
    });

    await database.connection.db.insert(organizationMembersTable).values({
      organizationId,
      role: "agent",
      userId,
    });

    await expect(
      getOrganizationMemberStatusesRepository(testDatabase).updateStatusByOrganizationIdAndUserId({
        currentStatus: "active",
        organizationId,
        status: "deactivated",
        userId,
      }),
    ).resolves.toEqual({
      membershipStatus: "deactivated",
      organizationId,
      role: "agent",
      userId,
    });
  });

  it("returns null when updating a status changed by another write", async () => {
    const database = getOrganizationMembersTestDatabase(testDatabase);
    const organizationId = "14141414-1414-4414-8414-141414141414";
    const userId = "15151515-1515-4515-8515-151515151515";

    await database.connection.db.insert(organizationsTable).values({
      id: organizationId,
      name: "Status Conflict Support",
      status: "active",
    });

    await database.connection.db.insert(usersTable).values({
      id: userId,
      email: "status-conflict-agent@example.com",
      name: "Status Conflict Agent",
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
      getOrganizationMemberStatusesRepository(testDatabase).updateStatusByOrganizationIdAndUserId({
        currentStatus: "active",
        organizationId,
        status: "deactivated",
        userId,
      }),
    ).resolves.toBeNull();
  });
});

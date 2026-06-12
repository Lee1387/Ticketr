import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { organizationMembersTable } from "../../../infrastructure/db/schema/organizationMembers.js";
import { organizationsTable } from "../../../infrastructure/db/schema/organizations.js";
import { usersTable } from "../../../infrastructure/db/schema/users.js";
import { createTestDatabase, type TestDatabase } from "../../../test/createTestDatabase.js";
import { OrganizationMembersRepository } from "../organizationMembers.repository.js";

describe("OrganizationMembersRepository integration", () => {
  let testDatabase: TestDatabase | undefined;

  beforeAll(async () => {
    testDatabase = await createTestDatabase();
  }, 120_000);

  afterAll(async () => {
    await testDatabase?.stop();
  }, 30_000);

  function getRepository(): OrganizationMembersRepository {
    if (testDatabase === undefined) {
      throw new Error("Test database was not initialized.");
    }

    return new OrganizationMembersRepository(testDatabase.connection.db);
  }

  it("finds an organization member by organization and user", async () => {
    if (testDatabase === undefined) {
      throw new Error("Test database was not initialized.");
    }

    const organizationId = "22222222-2222-4222-8222-222222222222";
    const userId = "11111111-1111-4111-8111-111111111111";

    await testDatabase.connection.db.insert(organizationsTable).values({
      id: organizationId,
      name: "Acme Support",
      status: "active",
    });

    await testDatabase.connection.db.insert(usersTable).values({
      id: userId,
      email: "agent@example.com",
      name: "Support Agent",
      status: "active",
    });

    await testDatabase.connection.db.insert(organizationMembersTable).values({
      organizationId,
      role: "agent",
      userId,
    });

    await expect(
      getRepository().findByOrganizationIdAndUserId({
        organizationId,
        userId,
      }),
    ).resolves.toMatchObject({
      organizationId,
      role: "agent",
      userId,
    });
  });

  it("returns null when the user is not a member of the organization", async () => {
    await expect(
      getRepository().findByOrganizationIdAndUserId({
        organizationId: "33333333-3333-4333-8333-333333333333",
        userId: "11111111-1111-4111-8111-111111111111",
      }),
    ).resolves.toBeNull();
  });
});

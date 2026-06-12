import { afterAll, beforeAll, beforeEach } from "vitest";

import { invitationsTable } from "../../../../infrastructure/db/schema/invitations.js";
import { organizationMembersTable } from "../../../../infrastructure/db/schema/organizationMembers.js";
import { organizationsTable } from "../../../../infrastructure/db/schema/organizations.js";
import { usersTable } from "../../../../infrastructure/db/schema/users.js";
import { createTestDatabase, type TestDatabase } from "../../../../test/createTestDatabase.js";
import { InvitationAcceptanceRepository } from "../../persistence/invitationAcceptance.repository.js";
import { InvitationsRepository } from "../../persistence/invitations.repository.js";

export const invitationRepositoryTestOrganizationId = "11111111-1111-4111-8111-111111111111";

export const invitationRepositoryTestExpiresAt = new Date("2030-01-01T00:00:00.000Z");

export type InvitationsRepositoryTestContext = {
  getAcceptanceRepository: () => InvitationAcceptanceRepository;
  getRepository: () => InvitationsRepository;
  getTestDatabase: () => TestDatabase;
};

export function setupInvitationsRepositoryTest(): InvitationsRepositoryTestContext {
  let testDatabase: TestDatabase | undefined;

  beforeAll(async () => {
    testDatabase = await createTestDatabase();
  }, 120_000);

  beforeEach(async () => {
    const db = getTestDatabase().connection.db;

    await db.delete(organizationMembersTable);
    await db.delete(invitationsTable);
    await db.delete(usersTable);
    await db.delete(organizationsTable);
    await db.insert(organizationsTable).values({
      id: invitationRepositoryTestOrganizationId,
      name: "Acme Support",
      status: "active",
    });
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

  function getAcceptanceRepository(): InvitationAcceptanceRepository {
    return new InvitationAcceptanceRepository(getTestDatabase().connection.db);
  }

  function getRepository(): InvitationsRepository {
    return new InvitationsRepository(getTestDatabase().connection.db);
  }

  return {
    getAcceptanceRepository,
    getRepository,
    getTestDatabase,
  };
}

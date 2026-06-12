import type { TestDatabase } from "../../../../test/createTestDatabase.js";
import { OrganizationMembersRepository } from "../../persistence/organizationMembers.repository.js";

export function getOrganizationMembersRepository(
  testDatabase: TestDatabase | undefined,
): OrganizationMembersRepository {
  if (testDatabase === undefined) {
    throw new Error("Test database was not initialized.");
  }

  return new OrganizationMembersRepository(testDatabase.connection.db);
}

export function getOrganizationMembersTestDatabase(
  testDatabase: TestDatabase | undefined,
): TestDatabase {
  if (testDatabase === undefined) {
    throw new Error("Test database was not initialized.");
  }

  return testDatabase;
}

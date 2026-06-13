import type { TestDatabase } from "../../../../test/createTestDatabase.js";
import { OrganizationMemberRolesRepository } from "../../persistence/organizationMemberRoles.repository.js";
import { OrganizationMemberStatusesRepository } from "../../persistence/organizationMemberStatuses.repository.js";
import { OrganizationMembershipsRepository } from "../../persistence/organizationMemberships.repository.js";
import { OrganizationMembersReaderRepository } from "../../persistence/organizationMembersReader.repository.js";

export function getOrganizationMemberRolesRepository(
  testDatabase: TestDatabase | undefined,
): OrganizationMemberRolesRepository {
  if (testDatabase === undefined) {
    throw new Error("Test database was not initialized.");
  }

  return new OrganizationMemberRolesRepository(testDatabase.connection.db);
}

export function getOrganizationMemberStatusesRepository(
  testDatabase: TestDatabase | undefined,
): OrganizationMemberStatusesRepository {
  if (testDatabase === undefined) {
    throw new Error("Test database was not initialized.");
  }

  return new OrganizationMemberStatusesRepository(testDatabase.connection.db);
}

export function getOrganizationMembershipsRepository(
  testDatabase: TestDatabase | undefined,
): OrganizationMembershipsRepository {
  if (testDatabase === undefined) {
    throw new Error("Test database was not initialized.");
  }

  return new OrganizationMembershipsRepository(testDatabase.connection.db);
}

export function getOrganizationMembersReaderRepository(
  testDatabase: TestDatabase | undefined,
): OrganizationMembersReaderRepository {
  if (testDatabase === undefined) {
    throw new Error("Test database was not initialized.");
  }

  return new OrganizationMembersReaderRepository(testDatabase.connection.db);
}

export function getOrganizationMembersTestDatabase(
  testDatabase: TestDatabase | undefined,
): TestDatabase {
  if (testDatabase === undefined) {
    throw new Error("Test database was not initialized.");
  }

  return testDatabase;
}

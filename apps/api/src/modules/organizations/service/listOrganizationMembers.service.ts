import { organizationNotFoundMessage } from "../domain/organizations.constants.js";
import type {
  OrganizationMembersReaderPort,
  OrganizationsRepositoryPort,
} from "./organizations.service.ports.js";
import type {
  ListOrganizationMembersQuery,
  ListOrganizationMembersResult,
} from "./organizations.service.types.js";

type ListOrganizationMembersDependencies = {
  organizationMembersReader: OrganizationMembersReaderPort;
  organizationsRepository: OrganizationsRepositoryPort;
};

export async function listOrganizationMembers(
  query: ListOrganizationMembersQuery,
  dependencies: ListOrganizationMembersDependencies,
): Promise<ListOrganizationMembersResult> {
  const organization = await dependencies.organizationsRepository.findById(query.organizationId);

  if (organization === null) {
    return {
      status: "not-found",
      message: organizationNotFoundMessage,
    };
  }

  const members = await dependencies.organizationMembersReader.listByOrganizationId({
    organizationId: query.organizationId,
    limit: query.query.limit,
    ...(query.query.createdBefore === undefined
      ? {}
      : { createdBefore: query.query.createdBefore }),
  });

  return {
    status: "found",
    members,
  };
}

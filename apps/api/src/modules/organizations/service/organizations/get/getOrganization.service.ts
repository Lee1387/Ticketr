import { organizationNotFoundMessage } from "../../../domain/organizations.constants.js";
import type { OrganizationsRepositoryPort } from "../../contracts/organizations.service.ports.js";
import type {
  GetOrganizationQuery,
  GetOrganizationResult,
} from "../../contracts/organizations.service.types.js";

type GetOrganizationDependencies = {
  organizationsRepository: OrganizationsRepositoryPort;
};

export async function getOrganization(
  query: GetOrganizationQuery,
  dependencies: GetOrganizationDependencies,
): Promise<GetOrganizationResult> {
  const organization = await dependencies.organizationsRepository.findById(query.organizationId);

  if (organization === null) {
    return {
      status: "not-found",
      message: organizationNotFoundMessage,
    };
  }

  return {
    status: "found",
    organization,
  };
}

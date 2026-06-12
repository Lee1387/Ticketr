import { organizationNotFoundMessage } from "../domain/organizations.constants.js";
import { listOrganizationMembers } from "./listOrganizationMembers.service.js";
import type {
  OrganizationMembersReaderPort,
  OrganizationsRepositoryPort,
} from "./organizations.service.ports.js";
import type {
  GetOrganizationQuery,
  GetOrganizationResult,
  ListOrganizationMembersQuery,
  ListOrganizationMembersResult,
} from "./organizations.service.types.js";

export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepositoryPort,
    private readonly organizationMembersReader: OrganizationMembersReaderPort,
  ) {}

  async getOrganization(query: GetOrganizationQuery): Promise<GetOrganizationResult> {
    const organization = await this.organizationsRepository.findById(query.organizationId);

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

  async listOrganizationMembers(
    query: ListOrganizationMembersQuery,
  ): Promise<ListOrganizationMembersResult> {
    return listOrganizationMembers(query, {
      organizationMembersReader: this.organizationMembersReader,
      organizationsRepository: this.organizationsRepository,
    });
  }
}

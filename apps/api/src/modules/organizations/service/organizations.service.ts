import { organizationNotFoundMessage } from "../domain/organizations.constants.js";
import type { OrganizationsRepositoryPort } from "./organizations.service.ports.js";
import type { GetOrganizationQuery, GetOrganizationResult } from "./organizations.service.types.js";

export class OrganizationsService {
  constructor(private readonly organizationsRepository: OrganizationsRepositoryPort) {}

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
}

import { organizationNotFoundMessage } from "./organizations.constants.js";
import type { OrganizationId, OrganizationStatus } from "./organizations.types.js";

export type Organization = {
  id: OrganizationId;
  name: string;
  status: OrganizationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationsRepositoryPort = {
  findById: (id: OrganizationId) => Promise<Organization | null>;
};

export type GetOrganizationQuery = {
  organizationId: OrganizationId;
};

export type GetOrganizationResult =
  | {
      status: "not-found";
      message: string;
    }
  | {
      status: "found";
      organization: Organization;
    };

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

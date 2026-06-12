import type { OrganizationId } from "../domain/organizations.types.js";
import type { Organization, OrganizationMember } from "./organizations.service.models.js";

export type OrganizationsRepositoryPort = {
  findById: (id: OrganizationId) => Promise<Organization | null>;
};

export type OrganizationMembersReaderPort = {
  listByOrganizationId: (input: {
    createdBefore?: Date;
    limit: number;
    organizationId: OrganizationId;
  }) => Promise<OrganizationMember[]>;
};

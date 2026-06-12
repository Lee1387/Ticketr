import type {
  ListOrganizationMembersQueryInput,
  OrganizationId,
} from "../domain/organizations.types.js";
import type { Organization, OrganizationMember } from "./organizations.service.models.js";

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

export type ListOrganizationMembersQuery = {
  organizationId: OrganizationId;
  query: ListOrganizationMembersQueryInput;
};

export type ListOrganizationMembersResult =
  | {
      status: "not-found";
      message: string;
    }
  | {
      status: "found";
      members: OrganizationMember[];
    };

import type { OrganizationId } from "../domain/organizations.types.js";
import type { Organization } from "./organizations.service.models.js";

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

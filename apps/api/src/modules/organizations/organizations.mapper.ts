import type { Organization } from "./organizations.service.js";

export type OrganizationResponse = {
  id: string;
  name: string;
  status: Organization["status"];
  createdAt: string;
  updatedAt: string;
};

export function toOrganizationResponse(organization: Organization): OrganizationResponse {
  return {
    id: organization.id,
    name: organization.name,
    status: organization.status,
    createdAt: organization.createdAt.toISOString(),
    updatedAt: organization.updatedAt.toISOString(),
  };
}

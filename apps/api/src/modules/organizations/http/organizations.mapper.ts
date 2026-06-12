import type { Organization, OrganizationMember } from "../service/organizations.service.models.js";

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

export type OrganizationMemberResponse = {
  createdAt: string;
  email: string;
  name: string;
  role: OrganizationMember["role"];
  status: OrganizationMember["status"];
  userId: string;
};

export function toOrganizationMemberResponse(
  member: OrganizationMember,
): OrganizationMemberResponse {
  return {
    createdAt: member.createdAt.toISOString(),
    email: member.email,
    name: member.name,
    role: member.role,
    status: member.status,
    userId: member.userId,
  };
}

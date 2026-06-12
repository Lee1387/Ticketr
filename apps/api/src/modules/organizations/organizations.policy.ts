import type { OrganizationMemberRole } from "./organizations.types.js";

const canReadOrganizationByRole: Record<OrganizationMemberRole, boolean> = {
  owner: true,
  admin: true,
  agent: true,
};

export function canReadOrganization(input: { role: OrganizationMemberRole }): boolean {
  return canReadOrganizationByRole[input.role];
}

export function canReadOrganizationTickets(input: { role: OrganizationMemberRole }): boolean {
  return canReadOrganization(input);
}

import type { OrganizationMemberRole } from "./organizations.types.js";

const canReadOrganizationByRole: Record<OrganizationMemberRole, boolean> = {
  owner: true,
  admin: true,
  agent: true,
};

type OrganizationPermissionInput = {
  role: OrganizationMemberRole;
};

export function canReadOrganization(input: OrganizationPermissionInput): boolean {
  return canReadOrganizationByRole[input.role];
}

export function canReadOrganizationTickets(input: OrganizationPermissionInput): boolean {
  return canReadOrganization(input);
}

export function canCreateOrganizationTicket(input: OrganizationPermissionInput): boolean {
  return canReadOrganization(input);
}

export function canUpdateOrganizationTicketStatus(input: OrganizationPermissionInput): boolean {
  return canReadOrganization(input);
}

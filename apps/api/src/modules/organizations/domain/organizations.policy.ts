import type { OrganizationMemberRole } from "../domain/organizations.types.js";

const canReadOrganizationByRole: Record<OrganizationMemberRole, boolean> = {
  owner: true,
  admin: true,
  agent: true,
};

const canManageOrganizationInvitationsByRole: Record<OrganizationMemberRole, boolean> = {
  owner: true,
  admin: true,
  agent: false,
};

const canManageOrganizationMemberRolesByRole: Record<OrganizationMemberRole, boolean> = {
  owner: true,
  admin: true,
  agent: false,
};

const canDeactivateOrganizationMembersByRole: Record<OrganizationMemberRole, boolean> = {
  owner: true,
  admin: true,
  agent: false,
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

export function canManageOrganizationInvitations(input: OrganizationPermissionInput): boolean {
  return canManageOrganizationInvitationsByRole[input.role];
}

export function canManageOrganizationMemberRoles(input: OrganizationPermissionInput): boolean {
  return canManageOrganizationMemberRolesByRole[input.role];
}

export function canDeactivateOrganizationMembers(input: OrganizationPermissionInput): boolean {
  return canDeactivateOrganizationMembersByRole[input.role];
}

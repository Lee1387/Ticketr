import type { OrganizationId, OrganizationMemberRole } from "./organizations.types.js";

const canReadOrganizationByRole: Record<OrganizationMemberRole, boolean> = {
  owner: true,
  admin: true,
  agent: true,
};

type ScopedOrganizationAccessInput = {
  organizationId: OrganizationId;
  requestedOrganizationId: OrganizationId;
  role: OrganizationMemberRole;
};

export function canReadOrganization(input: ScopedOrganizationAccessInput): boolean {
  return canReadScopedOrganizationResource(input);
}

export function canReadOrganizationTickets(input: ScopedOrganizationAccessInput): boolean {
  return canReadScopedOrganizationResource(input);
}

export function canCreateOrganizationTicket(input: ScopedOrganizationAccessInput): boolean {
  return canReadScopedOrganizationResource(input);
}

export function canUpdateOrganizationTicketStatus(input: ScopedOrganizationAccessInput): boolean {
  return canReadScopedOrganizationResource(input);
}

function canReadScopedOrganizationResource(input: ScopedOrganizationAccessInput): boolean {
  return (
    input.organizationId === input.requestedOrganizationId && canReadOrganizationByRole[input.role]
  );
}

import type { FastifyInstance, FastifyRequest } from "fastify";

import { requireAuth } from "../../../app/auth/requireAuth.js";
import type { OrganizationAccessService } from "../../organizations/service/organizationAccess.service.js";
import {
  canCreateOrganizationTicket,
  canReadOrganizationTickets,
  canUpdateOrganizationTicketStatus,
} from "../../organizations/domain/organizations.policy.js";
import type {
  OrganizationId,
  OrganizationMemberRole,
} from "../../organizations/domain/organizations.types.js";

export function authorizeOrganizationTicketRead(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  request: FastifyRequest,
  organizationId: OrganizationId,
): Promise<void> {
  return authorizeOrganizationTicketAction(
    app,
    organizationAccessService,
    request,
    organizationId,
    canReadOrganizationTickets,
    "You do not have access to this organization's tickets.",
  );
}

export function authorizeOrganizationTicketCreate(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  request: FastifyRequest,
  organizationId: OrganizationId,
): Promise<void> {
  return authorizeOrganizationTicketAction(
    app,
    organizationAccessService,
    request,
    organizationId,
    canCreateOrganizationTicket,
    "You do not have access to create tickets for this organization.",
  );
}

export function authorizeOrganizationTicketStatusUpdate(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  request: FastifyRequest,
  organizationId: OrganizationId,
): Promise<void> {
  return authorizeOrganizationTicketAction(
    app,
    organizationAccessService,
    request,
    organizationId,
    canUpdateOrganizationTicketStatus,
    "You do not have access to update ticket status for this organization.",
  );
}

async function authorizeOrganizationTicketAction(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  request: FastifyRequest,
  organizationId: OrganizationId,
  canAccess: (input: { role: OrganizationMemberRole }) => boolean,
  forbiddenMessage: string,
): Promise<void> {
  const auth = requireAuth(request, app);
  const access = await organizationAccessService.verifyOrganizationMembership({
    auth,
    organizationId,
  });

  if (access.status === "not-member") {
    throw app.httpErrors.forbidden(forbiddenMessage);
  }

  if (
    !canAccess({
      role: access.role,
    })
  ) {
    throw app.httpErrors.forbidden(forbiddenMessage);
  }
}

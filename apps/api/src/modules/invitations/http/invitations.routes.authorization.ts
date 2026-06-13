import type { FastifyInstance, FastifyRequest } from "fastify";

import { requireAuth } from "../../../app/auth/requireAuth.js";
import type { OrganizationAccessService } from "../../organizations/service/access/organizationAccess.service.js";
import { canManageOrganizationInvitations } from "../../organizations/domain/organizations.policy.js";
import type { OrganizationId } from "../../organizations/domain/organizations.types.js";

const createInvitationForbiddenMessage =
  "You do not have access to create invitations for this organization.";

const listInvitationsForbiddenMessage =
  "You do not have access to list invitations for this organization.";

const revokeInvitationForbiddenMessage =
  "You do not have access to revoke invitations for this organization.";

export async function authorizeOrganizationInvitationCreate(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  request: FastifyRequest,
  organizationId: OrganizationId,
): Promise<void> {
  await authorizeOrganizationInvitationManagement(
    app,
    organizationAccessService,
    request,
    organizationId,
    createInvitationForbiddenMessage,
  );
}

export async function authorizeOrganizationInvitationList(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  request: FastifyRequest,
  organizationId: OrganizationId,
): Promise<void> {
  await authorizeOrganizationInvitationManagement(
    app,
    organizationAccessService,
    request,
    organizationId,
    listInvitationsForbiddenMessage,
  );
}

export async function authorizeOrganizationInvitationRevoke(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  request: FastifyRequest,
  organizationId: OrganizationId,
): Promise<void> {
  await authorizeOrganizationInvitationManagement(
    app,
    organizationAccessService,
    request,
    organizationId,
    revokeInvitationForbiddenMessage,
  );
}

async function authorizeOrganizationInvitationManagement(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  request: FastifyRequest,
  organizationId: OrganizationId,
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

  if (!canManageOrganizationInvitations({ role: access.role })) {
    throw app.httpErrors.forbidden(forbiddenMessage);
  }
}

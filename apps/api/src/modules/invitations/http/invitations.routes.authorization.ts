import type { FastifyInstance, FastifyRequest } from "fastify";

import { requireAuth } from "../../../app/auth/requireAuth.js";
import type { OrganizationAccessService } from "../../organizations/service/organizationAccess.service.js";
import { canCreateOrganizationInvitation } from "../../organizations/domain/organizations.policy.js";
import type { OrganizationId } from "../../organizations/domain/organizations.types.js";

const createInvitationForbiddenMessage =
  "You do not have access to create invitations for this organization.";

export async function authorizeOrganizationInvitationCreate(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  request: FastifyRequest,
  organizationId: OrganizationId,
): Promise<void> {
  const auth = requireAuth(request, app);
  const access = await organizationAccessService.verifyOrganizationMembership({
    auth,
    organizationId,
  });

  if (access.status === "not-member") {
    throw app.httpErrors.forbidden(createInvitationForbiddenMessage);
  }

  if (!canCreateOrganizationInvitation({ role: access.role })) {
    throw app.httpErrors.forbidden(createInvitationForbiddenMessage);
  }
}

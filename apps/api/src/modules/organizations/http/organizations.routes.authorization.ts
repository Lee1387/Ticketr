import type { FastifyInstance, FastifyRequest } from "fastify";

import { requireAuth } from "../../../app/auth/requireAuth.js";
import { canReadOrganization } from "../domain/organizations.policy.js";
import type { OrganizationId, OrganizationMemberRole } from "../domain/organizations.types.js";
import type { OrganizationAccessService } from "../service/access/organizationAccess.service.js";

const organizationReadForbiddenMessage = "You do not have access to this organization.";

export async function authorizeOrganizationRead(
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
    throw app.httpErrors.forbidden(organizationReadForbiddenMessage);
  }

  if (!canReadOrganization({ role: access.role })) {
    throw app.httpErrors.forbidden(organizationReadForbiddenMessage);
  }
}

export async function authorizeOrganizationMembership(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  request: FastifyRequest,
  organizationId: OrganizationId,
): Promise<OrganizationMemberRole> {
  const auth = requireAuth(request, app);
  const access = await organizationAccessService.verifyOrganizationMembership({
    auth,
    organizationId,
  });

  if (access.status === "not-member") {
    throw app.httpErrors.forbidden(organizationReadForbiddenMessage);
  }

  return access.role;
}

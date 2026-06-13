import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../../service/access/organizationAccess.service.js";
import type { OrganizationsService } from "../../service/organizations.service.js";
import { toOrganizationMemberStatusResponse } from "../organizations.mapper.js";
import { authorizeOrganizationMembership } from "../organizations.routes.authorization.js";
import { deactivateOrganizationMemberRequestSchema } from "../organizations.routes.schemas.js";

export function registerDeactivateOrganizationMemberRoute(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  organizationsService: OrganizationsService,
): void {
  app.delete("/organizations/:organizationId/members/:userId", async (request) => {
    const validatedRequest = validateRequest(deactivateOrganizationMemberRequestSchema, request);
    const actorRole = await authorizeOrganizationMembership(
      app,
      organizationAccessService,
      request,
      validatedRequest.params.organizationId,
    );

    const result = await organizationsService.deactivateOrganizationMember({
      actorRole,
      organizationId: validatedRequest.params.organizationId,
      userId: validatedRequest.params.userId,
    });

    switch (result.status) {
      case "organization-not-found":
      case "member-not-found":
        throw app.httpErrors.notFound(result.message);
      case "forbidden":
        throw app.httpErrors.forbidden(result.message);
      case "conflict":
        throw app.httpErrors.conflict(result.message);
      case "deactivated":
        return {
          member: toOrganizationMemberStatusResponse(result.member),
        };
    }
  });
}

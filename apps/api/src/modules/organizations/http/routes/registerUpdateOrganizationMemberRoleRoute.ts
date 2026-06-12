import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../../service/organizationAccess.service.js";
import type { OrganizationsService } from "../../service/organizations.service.js";
import { toOrganizationMemberRoleResponse } from "../organizations.mapper.js";
import { authorizeOrganizationMembership } from "../organizations.routes.authorization.js";
import { updateOrganizationMemberRoleRequestSchema } from "../organizations.routes.schemas.js";

export function registerUpdateOrganizationMemberRoleRoute(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  organizationsService: OrganizationsService,
): void {
  app.patch("/organizations/:organizationId/members/:userId/role", async (request) => {
    const validatedRequest = validateRequest(updateOrganizationMemberRoleRequestSchema, request);
    const actorRole = await authorizeOrganizationMembership(
      app,
      organizationAccessService,
      request,
      validatedRequest.params.organizationId,
    );

    const result = await organizationsService.updateOrganizationMemberRole({
      actorRole,
      input: validatedRequest.body,
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
      case "updated":
        return {
          member: toOrganizationMemberRoleResponse(result.member),
        };
    }
  });
}

import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../../service/access/organizationAccess.service.js";
import type { OrganizationsService } from "../../service/organizations.service.js";
import { toOrganizationMemberResponse } from "../organizations.mapper.js";
import { authorizeOrganizationRead } from "../organizations.routes.authorization.js";
import { listOrganizationMembersRequestSchema } from "../organizations.routes.schemas.js";

export function registerListOrganizationMembersRoute(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  organizationsService: OrganizationsService,
): void {
  app.get("/organizations/:organizationId/members", async (request) => {
    const validatedRequest = validateRequest(listOrganizationMembersRequestSchema, request);
    await authorizeOrganizationRead(
      app,
      organizationAccessService,
      request,
      validatedRequest.params.organizationId,
    );

    const result = await organizationsService.listOrganizationMembers({
      organizationId: validatedRequest.params.organizationId,
      query: validatedRequest.query,
    });

    switch (result.status) {
      case "not-found":
        throw app.httpErrors.notFound(result.message);
      case "found":
        return {
          members: result.members.map(toOrganizationMemberResponse),
        };
    }
  });
}

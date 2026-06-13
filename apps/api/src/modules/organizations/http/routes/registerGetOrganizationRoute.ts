import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../../service/access/organizationAccess.service.js";
import type { OrganizationsService } from "../../service/organizations.service.js";
import { toOrganizationResponse } from "../organizations.mapper.js";
import { authorizeOrganizationRead } from "../organizations.routes.authorization.js";
import { getOrganizationRequestSchema } from "../organizations.routes.schemas.js";

export function registerGetOrganizationRoute(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  organizationsService: OrganizationsService,
): void {
  app.get("/organizations/:organizationId", async (request) => {
    const validatedRequest = validateRequest(getOrganizationRequestSchema, request);
    await authorizeOrganizationRead(
      app,
      organizationAccessService,
      request,
      validatedRequest.params.organizationId,
    );

    const result = await organizationsService.getOrganization({
      organizationId: validatedRequest.params.organizationId,
    });

    switch (result.status) {
      case "not-found":
        throw app.httpErrors.notFound(result.message);
      case "found":
        return {
          organization: toOrganizationResponse(result.organization),
        };
    }
  });
}

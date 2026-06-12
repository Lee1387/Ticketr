import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { requireAuth } from "../../../app/auth/requireAuth.js";
import { validateRequest } from "../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../service/organizationAccess.service.js";
import { toOrganizationResponse } from "./organizations.mapper.js";
import { canReadOrganization } from "../domain/organizations.policy.js";
import { organizationIdSchema } from "../domain/organizations.schemas.js";
import type { OrganizationsService } from "../service/organizations.service.js";

const getOrganizationRequestSchema = z.object({
  body: z.undefined(),
  params: z.object({
    organizationId: organizationIdSchema,
  }),
  query: z.object({}),
});

export function registerOrganizationRoutes(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  organizationsService: OrganizationsService,
): void {
  app.get("/organizations/:organizationId", async (request) => {
    const validatedRequest = validateRequest(getOrganizationRequestSchema, request);
    const auth = requireAuth(request, app);
    const access = await organizationAccessService.verifyOrganizationMembership({
      auth,
      organizationId: validatedRequest.params.organizationId,
    });

    if (access.status === "not-member") {
      throw app.httpErrors.forbidden("You do not have access to this organization.");
    }

    if (
      !canReadOrganization({
        role: access.role,
      })
    ) {
      throw app.httpErrors.forbidden("You do not have access to this organization.");
    }

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

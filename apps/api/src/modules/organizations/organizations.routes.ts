import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { validateRequest } from "../../app/validation/validateRequest.js";
import { toOrganizationResponse } from "./organizations.mapper.js";
import { organizationIdSchema } from "./organizations.schemas.js";
import type { OrganizationsService } from "./organizations.service.js";

const getOrganizationRequestSchema = z.object({
  body: z.undefined(),
  params: z.object({
    organizationId: organizationIdSchema,
  }),
  query: z.object({}),
});

export function registerOrganizationRoutes(
  app: FastifyInstance,
  organizationsService: OrganizationsService,
): void {
  app.get("/organizations/:organizationId", async (request) => {
    const validatedRequest = validateRequest(getOrganizationRequestSchema, request);
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

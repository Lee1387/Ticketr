import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../../organizations/service/access/organizationAccess.service.js";
import type { AuthService } from "../service/auth.service.js";
import { createDevelopmentTokenRequestSchema } from "./auth.routes.schemas.js";

export function registerDevelopmentTokenRoute(
  app: FastifyInstance,
  authService: AuthService,
  organizationAccessService: OrganizationAccessService,
): void {
  app.post("/auth/dev-token", async (request) => {
    const validatedRequest = validateRequest(createDevelopmentTokenRequestSchema, request);
    const userVerification = await authService.verifyAuthenticatedUser({
      userId: validatedRequest.body.userId,
    });

    if (userVerification.status === "invalid") {
      throw app.httpErrors.unauthorized("Development token user is invalid.");
    }

    const organizationAccess = await organizationAccessService.verifyOrganizationMembership({
      auth: validatedRequest.body,
      organizationId: validatedRequest.body.organizationId,
    });

    if (organizationAccess.status === "not-member") {
      throw app.httpErrors.forbidden("Development token user is not an organization member.");
    }

    return {
      accessToken: app.jwt.sign(validatedRequest.body),
      tokenType: "Bearer",
    };
  });
}

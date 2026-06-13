import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../../organizations/service/access/organizationAccess.service.js";
import type { AuthService } from "../service/auth.service.js";
import { loginRequestSchema } from "./auth.routes.schemas.js";

const invalidLoginMessage = "Invalid email, password, or organization.";

const loginRateLimitOptions = {
  max: 5,
  timeWindow: "1 minute",
};

export function registerLoginRoute(
  app: FastifyInstance,
  authService: AuthService,
  organizationAccessService: OrganizationAccessService,
): void {
  app.post("/auth/login", { preHandler: app.rateLimit(loginRateLimitOptions) }, async (request) => {
    const validatedRequest = validateRequest(loginRequestSchema, request);
    const loginResult = await authService.login({
      email: validatedRequest.body.email,
      password: validatedRequest.body.password,
    });

    if (loginResult.status === "invalid-credentials") {
      throw app.httpErrors.unauthorized(invalidLoginMessage);
    }

    const auth = {
      organizationId: validatedRequest.body.organizationId,
      userId: loginResult.userId,
    };
    const organizationAccess = await organizationAccessService.verifyOrganizationMembership({
      auth,
      organizationId: validatedRequest.body.organizationId,
    });

    if (organizationAccess.status === "not-member") {
      throw app.httpErrors.unauthorized(invalidLoginMessage);
    }

    return {
      accessToken: app.jwt.sign(auth),
      tokenType: "Bearer",
    };
  });
}

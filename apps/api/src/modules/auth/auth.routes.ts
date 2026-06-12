import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { validateRequest } from "../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../organizations/organizationAccess.service.js";
import { createDevelopmentTokenSchema, loginSchema } from "./auth.schemas.js";
import type { AuthService } from "./auth.service.js";

const invalidLoginMessage = "Invalid email, password, or organization.";

const loginRateLimitOptions = {
  max: 5,
  timeWindow: "1 minute",
};

const createDevelopmentTokenRequestSchema = z.object({
  body: createDevelopmentTokenSchema,
  params: z.object({}),
  query: z.object({}),
});

const loginRequestSchema = z.object({
  body: loginSchema,
  params: z.object({}),
  query: z.object({}),
});

export type RegisterAuthRoutesOptions = {
  enableDevelopmentAuthRoutes: boolean;
};

export function registerAuthRoutes(
  app: FastifyInstance,
  authService: AuthService,
  organizationAccessService: OrganizationAccessService,
  options: RegisterAuthRoutesOptions,
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

  if (!options.enableDevelopmentAuthRoutes) {
    return;
  }

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

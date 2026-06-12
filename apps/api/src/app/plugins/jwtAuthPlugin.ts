import jwt from "@fastify/jwt";
import type { FastifyInstance, FastifyRequest } from "fastify";

import type { AuthService } from "../../modules/auth/auth.service.js";
import {
  jwtAuthClaimsSchema,
  type AuthenticatedUser,
  type JwtAuthClaims,
} from "../auth/authContext.js";

declare module "fastify" {
  interface FastifyRequest {
    auth: AuthenticatedUser | null;
  }
}

export type JwtAuthPluginOptions = {
  authService: AuthService;
  jwtAudience: string;
  jwtIssuer: string;
  jwtSecret: string;
};

export const jwtAccessTokenExpiresIn = "15m";

export function registerJwtAuthPlugin(app: FastifyInstance, options: JwtAuthPluginOptions): void {
  app.decorateRequest("auth", null);
  void app.register(jwt, {
    secret: options.jwtSecret,
    sign: {
      aud: options.jwtAudience,
      expiresIn: jwtAccessTokenExpiresIn,
      iss: options.jwtIssuer,
    },
    verify: {
      allowedAud: options.jwtAudience,
      allowedIss: options.jwtIssuer,
      maxAge: jwtAccessTokenExpiresIn,
    },
  });

  app.addHook("onRequest", async (request) => {
    if (request.headers.authorization === undefined) {
      request.auth = null;
      return;
    }

    const claims = await verifyJwtClaims(request).catch(() => {
      throw app.httpErrors.unauthorized("Authentication token is invalid.");
    });

    const userVerification = await options.authService.verifyAuthenticatedUser({
      userId: claims.userId,
    });

    if (userVerification.status === "invalid") {
      throw app.httpErrors.unauthorized("Authentication token is invalid.");
    }

    request.auth = {
      organizationId: claims.organizationId,
      userId: claims.userId,
    };
  });
}

async function verifyJwtClaims(request: FastifyRequest): Promise<JwtAuthClaims> {
  const payload = await request.jwtVerify<Record<string, unknown>>();

  return jwtAuthClaimsSchema.parse(payload);
}

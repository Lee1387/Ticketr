import jwt from "@fastify/jwt";
import type { FastifyInstance } from "fastify";

import { jwtAuthClaimsSchema, type AuthenticatedUser } from "../auth/authContext.js";

declare module "fastify" {
  interface FastifyRequest {
    auth: AuthenticatedUser | null;
  }
}

export type JwtAuthPluginOptions = {
  jwtSecret: string;
};

export const jwtAccessTokenExpiresIn = "15m";

export function registerJwtAuthPlugin(app: FastifyInstance, options: JwtAuthPluginOptions): void {
  app.decorateRequest("auth", null);
  void app.register(jwt, {
    secret: options.jwtSecret,
    sign: {
      expiresIn: jwtAccessTokenExpiresIn,
    },
    verify: {
      maxAge: jwtAccessTokenExpiresIn,
    },
  });

  app.addHook("onRequest", async (request) => {
    if (request.headers.authorization === undefined) {
      request.auth = null;
      return;
    }

    try {
      const payload = await request.jwtVerify<Record<string, unknown>>();
      const claims = jwtAuthClaimsSchema.parse(payload);
      request.auth = {
        organizationId: claims.organizationId,
        organizationRole: claims.organizationRole,
        userId: claims.userId,
      };
    } catch {
      throw app.httpErrors.unauthorized("Authentication token is invalid.");
    }
  });
}

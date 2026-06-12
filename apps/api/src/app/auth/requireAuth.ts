import type { FastifyInstance, FastifyRequest } from "fastify";

import type { AuthenticatedUser } from "./authContext.js";

export function requireAuth(request: FastifyRequest, app: FastifyInstance): AuthenticatedUser {
  if (request.auth === null) {
    throw app.httpErrors.unauthorized("Authentication is required.");
  }

  return request.auth;
}

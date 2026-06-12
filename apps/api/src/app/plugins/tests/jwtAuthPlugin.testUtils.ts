import type { FastifyInstance } from "fastify";

export function registerAuthContextTestRoute(app: FastifyInstance): void {
  app.get("/auth-context-test", (request) => {
    return {
      auth: request.auth,
    };
  });
}

export function registerProtectedTestRoute(app: FastifyInstance): void {
  app.get("/auth-context-test", () => {
    return {
      status: "ok",
    };
  });
}

export const invalidTokenResponse = {
  error: {
    code: "UNAUTHORIZED",
    message: "Authentication token is invalid.",
  },
};

import type { FastifyInstance } from "fastify";

import type { AuthenticatedUser } from "../app/auth/authContext.js";

export const defaultTestAuthPayload: AuthenticatedUser = {
  organizationId: "6b4df69e-0950-4209-b79a-a5b5d251540f",
  organizationRole: "agent",
  userId: "11111111-1111-4111-8111-111111111111",
};

export async function signTestAuthToken(
  app: FastifyInstance,
  payload: Record<string, unknown>,
): Promise<string> {
  await app.ready();

  return app.jwt.sign(payload);
}

export async function createAuthHeaders(
  app: FastifyInstance,
  overrides: Partial<AuthenticatedUser> = {},
): Promise<{ authorization: string }> {
  const token = await signTestAuthToken(app, {
    ...defaultTestAuthPayload,
    ...overrides,
  });

  return {
    authorization: `Bearer ${token}`,
  };
}

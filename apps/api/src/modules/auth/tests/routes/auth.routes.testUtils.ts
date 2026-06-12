import { z } from "zod";
import { vi } from "vitest";

import { AuthService } from "../../service/auth.service.js";

export const tokenResponseSchema = z.object({
  accessToken: z.string().min(1),
  tokenType: z.literal("Bearer"),
});

export const authRouteTestOrganizationId = "6b4df69e-0950-4209-b79a-a5b5d251540f";

export const authRouteTestUserId = "11111111-1111-4111-8111-111111111111";

export const loginRouteTestBody = {
  email: "agent@example.com",
  organizationId: authRouteTestOrganizationId,
  password: "Password123!",
};

export const developmentTokenRouteTestBody = {
  organizationId: authRouteTestOrganizationId,
  userId: authRouteTestUserId,
};

export function createActiveAuthService(passwordMatches: boolean): AuthService {
  return new AuthService(
    {
      findByEmail: vi.fn(() =>
        Promise.resolve({
          id: authRouteTestUserId,
          passwordHash: "stored-password-hash",
          status: "active" as const,
        }),
      ),
      findById: vi.fn(() => Promise.resolve({ status: "active" as const })),
    },
    vi.fn(() => Promise.resolve(passwordMatches)),
  );
}

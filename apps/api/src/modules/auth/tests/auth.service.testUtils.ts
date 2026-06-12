import { vi } from "vitest";

import type { AuthenticatedUserLookup } from "../auth.service.js";

export const authServiceTestUserId = "11111111-1111-4111-8111-111111111111";

export const authServiceTestUserEmail = "agent@example.com";

export const authServiceTestPassword = "correct-password";

export const authServiceTestPasswordHash = "stored-password-hash";

export function createAuthenticatedUserLookup(
  overrides: Partial<AuthenticatedUserLookup> = {},
): AuthenticatedUserLookup {
  return {
    findByEmail: vi.fn(() =>
      Promise.resolve({
        id: authServiceTestUserId,
        passwordHash: authServiceTestPasswordHash,
        status: "active" as const,
      }),
    ),
    findById: vi.fn(() => Promise.resolve({ status: "active" as const })),
    ...overrides,
  };
}

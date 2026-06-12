import { describe, expect, it, vi } from "vitest";

import { AuthService } from "../auth.service.js";

describe("AuthService", () => {
  const userId = "11111111-1111-4111-8111-111111111111";

  it("verifies an active authenticated user", async () => {
    const service = new AuthService({
      findById: vi.fn(() => Promise.resolve({ status: "active" as const })),
    });

    await expect(service.verifyAuthenticatedUser({ userId })).resolves.toEqual({
      status: "verified",
    });
  });

  it("rejects missing authenticated users", async () => {
    const service = new AuthService({
      findById: vi.fn(() => Promise.resolve(null)),
    });

    await expect(service.verifyAuthenticatedUser({ userId })).resolves.toEqual({
      status: "invalid",
    });
  });

  it("rejects suspended authenticated users", async () => {
    const service = new AuthService({
      findById: vi.fn(() => Promise.resolve({ status: "suspended" as const })),
    });

    await expect(service.verifyAuthenticatedUser({ userId })).resolves.toEqual({
      status: "invalid",
    });
  });
});

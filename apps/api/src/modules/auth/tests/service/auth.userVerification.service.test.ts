import { describe, expect, it, vi } from "vitest";

import { AuthService } from "../../service/auth.service.js";
import { authServiceTestUserId, createAuthenticatedUserLookup } from "./auth.service.testUtils.js";

describe("AuthService verifyAuthenticatedUser", () => {
  it("verifies an active authenticated user", async () => {
    const lookup = createAuthenticatedUserLookup();
    const service = new AuthService(lookup);

    await expect(
      service.verifyAuthenticatedUser({ userId: authServiceTestUserId }),
    ).resolves.toEqual({
      status: "verified",
    });
    expect(lookup.findById).toHaveBeenCalledWith(authServiceTestUserId);
  });

  it("rejects missing authenticated users", async () => {
    const service = new AuthService(
      createAuthenticatedUserLookup({
        findById: vi.fn(() => Promise.resolve(null)),
      }),
    );

    await expect(
      service.verifyAuthenticatedUser({ userId: authServiceTestUserId }),
    ).resolves.toEqual({
      status: "invalid",
    });
  });

  it("rejects suspended authenticated users", async () => {
    const service = new AuthService(
      createAuthenticatedUserLookup({
        findById: vi.fn(() => Promise.resolve({ status: "suspended" as const })),
      }),
    );

    await expect(
      service.verifyAuthenticatedUser({ userId: authServiceTestUserId }),
    ).resolves.toEqual({
      status: "invalid",
    });
  });
});

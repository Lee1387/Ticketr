import { describe, expect, it, vi } from "vitest";

import { AuthService } from "../auth.service.js";
import {
  authServiceTestPassword,
  authServiceTestPasswordHash,
  authServiceTestUserEmail,
  authServiceTestUserId,
  createAuthenticatedUserLookup,
} from "./auth.service.testUtils.js";

describe("AuthService login", () => {
  it("authenticates active users with matching credentials", async () => {
    const lookup = createAuthenticatedUserLookup();
    const passwordVerifier = vi.fn(() => Promise.resolve(true));
    const service = new AuthService(lookup, passwordVerifier);

    await expect(
      service.login({
        email: authServiceTestUserEmail,
        password: authServiceTestPassword,
      }),
    ).resolves.toEqual({
      status: "authenticated",
      userId: authServiceTestUserId,
    });
    expect(lookup.findByEmail).toHaveBeenCalledWith(authServiceTestUserEmail);
    expect(passwordVerifier).toHaveBeenCalledWith({
      password: authServiceTestPassword,
      passwordHash: authServiceTestPasswordHash,
    });
  });

  it("rejects missing users after checking a fallback password hash", async () => {
    const passwordVerifier = vi.fn(() => Promise.resolve(true));
    const service = new AuthService(
      createAuthenticatedUserLookup({
        findByEmail: vi.fn(() => Promise.resolve(null)),
      }),
      passwordVerifier,
    );

    await expect(
      service.login({
        email: authServiceTestUserEmail,
        password: authServiceTestPassword,
      }),
    ).resolves.toEqual({
      status: "invalid-credentials",
    });
    expect(passwordVerifier).toHaveBeenCalledOnce();
  });

  it("rejects suspended users after checking passwords", async () => {
    const passwordVerifier = vi.fn(() => Promise.resolve(true));
    const service = new AuthService(
      createAuthenticatedUserLookup({
        findByEmail: vi.fn(() =>
          Promise.resolve({
            id: authServiceTestUserId,
            passwordHash: authServiceTestPasswordHash,
            status: "suspended" as const,
          }),
        ),
      }),
      passwordVerifier,
    );

    await expect(
      service.login({
        email: authServiceTestUserEmail,
        password: authServiceTestPassword,
      }),
    ).resolves.toEqual({
      status: "invalid-credentials",
    });
    expect(passwordVerifier).toHaveBeenCalledWith({
      password: authServiceTestPassword,
      passwordHash: authServiceTestPasswordHash,
    });
  });

  it("rejects login when the password does not match", async () => {
    const service = new AuthService(
      createAuthenticatedUserLookup(),
      vi.fn(() => Promise.resolve(false)),
    );

    await expect(
      service.login({
        email: authServiceTestUserEmail,
        password: authServiceTestPassword,
      }),
    ).resolves.toEqual({
      status: "invalid-credentials",
    });
  });
});

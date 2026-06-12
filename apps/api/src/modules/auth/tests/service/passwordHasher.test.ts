import { describe, expect, it } from "vitest";

import {
  fallbackPasswordHash,
  hashPassword,
  verifyPassword,
} from "../../service/passwordHasher.js";

describe("passwordHasher", () => {
  it("hashes and verifies a password", async () => {
    const passwordHash = await hashPassword("correct-password");

    expect(passwordHash).toMatch(/^\$argon2id\$/u);
    await expect(
      verifyPassword({
        password: "correct-password",
        passwordHash,
      }),
    ).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const passwordHash = await hashPassword("correct-password");

    await expect(
      verifyPassword({
        password: "incorrect-password",
        passwordHash,
      }),
    ).resolves.toBe(false);
  });

  it("keeps the fallback password hash verifiable", async () => {
    await expect(
      verifyPassword({
        password: "incorrect-password",
        passwordHash: fallbackPasswordHash,
      }),
    ).resolves.toBe(false);
  });
});

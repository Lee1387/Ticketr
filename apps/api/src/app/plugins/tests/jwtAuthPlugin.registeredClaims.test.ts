import { describe, expect, it } from "vitest";

import { defaultTestAuthPayload } from "../../../test/authTestUtils.js";
import { createTestApp } from "../../../test/createTestApp.js";
import { invalidTokenResponse, registerProtectedTestRoute } from "./jwtAuthPlugin.testUtils.js";

describe("JWT auth plugin registered claim validation", () => {
  it("rejects expired bearer tokens", async () => {
    const app = createTestApp();

    try {
      registerProtectedTestRoute(app);

      await app.ready();
      const token = app.jwt.sign(defaultTestAuthPayload, {
        expiresIn: "-1s",
      });

      const response = await app.inject({
        method: "GET",
        url: "/auth-context-test",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual(invalidTokenResponse);
    } finally {
      await app.close();
    }
  });

  it("rejects bearer tokens with an unexpected issuer", async () => {
    const app = createTestApp();

    try {
      registerProtectedTestRoute(app);

      await app.ready();
      const token = app.jwt.sign(defaultTestAuthPayload, {
        iss: "unexpected-issuer",
      });

      const response = await app.inject({
        method: "GET",
        url: "/auth-context-test",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual(invalidTokenResponse);
    } finally {
      await app.close();
    }
  });

  it("rejects bearer tokens with an unexpected audience", async () => {
    const app = createTestApp();

    try {
      registerProtectedTestRoute(app);

      await app.ready();
      const token = app.jwt.sign(defaultTestAuthPayload, {
        aud: "unexpected-audience",
      });

      const response = await app.inject({
        method: "GET",
        url: "/auth-context-test",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual(invalidTokenResponse);
    } finally {
      await app.close();
    }
  });
});

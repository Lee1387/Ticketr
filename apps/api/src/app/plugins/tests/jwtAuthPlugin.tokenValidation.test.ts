import { describe, expect, it } from "vitest";

import { defaultTestAuthPayload, signTestAuthToken } from "../../../test/authTestUtils.js";
import { createTestApp } from "../../../test/createTestApp.js";
import { invalidTokenResponse, registerProtectedTestRoute } from "./jwtAuthPlugin.testUtils.js";

describe("JWT auth plugin token validation", () => {
  it("rejects invalid bearer tokens", async () => {
    const app = createTestApp();

    try {
      registerProtectedTestRoute(app);

      const response = await app.inject({
        method: "GET",
        url: "/auth-context-test",
        headers: {
          authorization: "Bearer not-a-token",
        },
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual(invalidTokenResponse);
    } finally {
      await app.close();
    }
  });

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

  it("rejects bearer tokens with invalid auth claims", async () => {
    const app = createTestApp();

    try {
      registerProtectedTestRoute(app);

      const token = await signTestAuthToken(app, {
        ...defaultTestAuthPayload,
        userId: "not-a-user-id",
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

import { describe, expect, it } from "vitest";

import {
  createAuthHeaders,
  defaultTestAuthPayload,
  signTestAuthToken,
} from "../../test/authTestUtils.js";
import { createTestApp } from "../../test/createTestApp.js";

describe("JWT auth plugin", () => {
  it("sets auth context from a valid bearer token", async () => {
    const app = createTestApp();

    try {
      app.get("/auth-context-test", (request) => {
        return {
          auth: request.auth,
        };
      });

      const response = await app.inject({
        method: "GET",
        url: "/auth-context-test",
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        auth: defaultTestAuthPayload,
      });
    } finally {
      await app.close();
    }
  });

  it("leaves auth context empty when a bearer token is missing", async () => {
    const app = createTestApp();

    try {
      app.get("/auth-context-test", (request) => {
        return {
          auth: request.auth,
        };
      });

      const response = await app.inject({
        method: "GET",
        url: "/auth-context-test",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        auth: null,
      });
    } finally {
      await app.close();
    }
  });

  it("rejects invalid bearer tokens", async () => {
    const app = createTestApp();

    try {
      app.get("/auth-context-test", () => {
        return {
          status: "ok",
        };
      });

      const response = await app.inject({
        method: "GET",
        url: "/auth-context-test",
        headers: {
          authorization: "Bearer not-a-token",
        },
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication token is invalid.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("rejects expired bearer tokens", async () => {
    const app = createTestApp();

    try {
      app.get("/auth-context-test", () => {
        return {
          status: "ok",
        };
      });

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
      expect(response.json()).toEqual({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication token is invalid.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("rejects bearer tokens with invalid auth claims", async () => {
    const app = createTestApp();

    try {
      app.get("/auth-context-test", () => {
        return {
          status: "ok",
        };
      });

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
      expect(response.json()).toEqual({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication token is invalid.",
        },
      });
    } finally {
      await app.close();
    }
  });
});

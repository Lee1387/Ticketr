import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../test/createTestApp.js";
import { requestIdHeaderName } from "../requestIdPlugin.js";

const uuidPattern = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/u;

describe("request ID plugin", () => {
  it("generates a request ID response header when one is not provided", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: "/health",
      });

      expect(response.headers[requestIdHeaderName]).toEqual(expect.stringMatching(uuidPattern));
    } finally {
      await app.close();
    }
  });

  it("reuses a valid incoming request ID response header", async () => {
    const app = createTestApp();
    const requestId = "client.request-id_123:abc";

    try {
      const response = await app.inject({
        method: "GET",
        url: "/health",
        headers: {
          [requestIdHeaderName]: requestId,
        },
      });

      expect(response.headers[requestIdHeaderName]).toBe(requestId);
    } finally {
      await app.close();
    }
  });

  it("replaces an invalid incoming request ID response header", async () => {
    const app = createTestApp();
    const requestId = "x".repeat(129);

    try {
      const response = await app.inject({
        method: "GET",
        url: "/health",
        headers: {
          [requestIdHeaderName]: requestId,
        },
      });

      expect(response.headers[requestIdHeaderName]).not.toBe(requestId);
      expect(response.headers[requestIdHeaderName]).toEqual(expect.stringMatching(uuidPattern));
    } finally {
      await app.close();
    }
  });
});

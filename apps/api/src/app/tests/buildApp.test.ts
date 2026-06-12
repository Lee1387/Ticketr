import { describe, expect, it } from "vitest";

import { createTestApp } from "../../test/createTestApp.js";
import { requestBodyLimitBytes } from "../buildApp.js";

describe("buildApp", () => {
  it("rejects request bodies over the configured size limit", async () => {
    const app = createTestApp();

    try {
      app.post("/body-limit-test", () => {
        return {
          status: "accepted",
        };
      });

      const response = await app.inject({
        method: "POST",
        url: "/body-limit-test",
        headers: {
          "content-type": "application/json",
        },
        payload: JSON.stringify({
          value: "x".repeat(requestBodyLimitBytes),
        }),
      });

      expect(response.statusCode).toBe(413);
      expect(response.json()).toEqual({
        error: {
          code: "PAYLOAD_TOO_LARGE",
          message: "Request body is too large",
        },
      });
    } finally {
      await app.close();
    }
  });
});

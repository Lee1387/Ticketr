import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../test/createTestApp.js";
import { RequestValidationError } from "../../validation/requestValidationError.js";

describe("error handler validation errors", () => {
  it("returns safe details for request validation errors", async () => {
    const app = createTestApp();

    try {
      app.post("/validation-error", () => {
        throw new RequestValidationError();
      });

      const response = await app.inject({
        method: "POST",
        url: "/validation-error",
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        error: {
          code: "BAD_REQUEST",
          message: "Request validation failed.",
        },
      });
    } finally {
      await app.close();
    }
  });
});

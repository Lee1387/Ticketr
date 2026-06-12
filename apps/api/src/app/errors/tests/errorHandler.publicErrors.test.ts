import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../test/createTestApp.js";

describe("error handler public errors", () => {
  it("returns safe details for sensible client errors", async () => {
    const app = createTestApp();

    try {
      app.get("/known-error", () => {
        throw app.httpErrors.notFound("Ticket was not found.");
      });

      const response = await app.inject({
        method: "GET",
        url: "/known-error",
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({
        error: {
          code: "NOT_FOUND",
          message: "Ticket was not found.",
        },
      });
    } finally {
      await app.close();
    }
  });
});

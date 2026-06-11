import { describe, expect, it } from "vitest";

import { buildApp } from "../buildApp.js";
import { ApiError } from "./apiError.js";

describe("error handler", () => {
  it("returns safe details for intentional API errors", async () => {
    const app = buildApp();

    try {
      app.get("/known-error", () => {
        throw new ApiError({
          code: "NOT_FOUND",
          message: "Ticket was not found.",
        });
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

  it("hides unexpected error details", async () => {
    const app = buildApp();

    try {
      app.get("/unexpected-error", () => {
        throw new Error("Database password leaked in stack trace.");
      });

      const response = await app.inject({
        method: "GET",
        url: "/unexpected-error",
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred.",
        },
      });
    } finally {
      await app.close();
    }
  });
});

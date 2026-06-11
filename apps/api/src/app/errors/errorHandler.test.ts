import { describe, expect, it } from "vitest";

import { buildApp } from "../buildApp.js";
import { RequestValidationError } from "../validation/requestValidationError.js";

describe("error handler", () => {
  it("returns safe details for sensible client errors", async () => {
    const app = buildApp();

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

  it("returns safe details for request validation errors", async () => {
    const app = buildApp();

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

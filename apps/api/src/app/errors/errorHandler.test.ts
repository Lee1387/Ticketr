import { Writable } from "node:stream";

import Fastify from "fastify";
import { describe, expect, it } from "vitest";

import { createTestApp } from "../../test/createTestApp.js";
import { RequestValidationError } from "../validation/requestValidationError.js";
import { registerErrorHandler } from "./errorHandler.js";

describe("error handler", () => {
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

  it("hides unexpected error details", async () => {
    const app = createTestApp();

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

  it("does not log unexpected error messages or stack traces", async () => {
    const logs: string[] = [];
    const app = Fastify({
      logger: {
        stream: new Writable({
          write(
            chunk: Buffer | string,
            encoding: BufferEncoding,
            callback: (error?: Error | null) => void,
          ): void {
            void encoding;
            logs.push(chunk.toString());
            callback();
          },
        }),
      },
    });

    try {
      registerErrorHandler(app);

      app.get("/unexpected-error", () => {
        throw new Error("Database password leaked in stack trace.");
      });

      await app.inject({
        method: "GET",
        url: "/unexpected-error",
      });

      const serializedLogs = logs.join("");

      expect(serializedLogs).toContain("Unhandled request error");
      expect(serializedLogs).toContain('"errorName":"Error"');
      expect(serializedLogs).not.toContain("Database password leaked in stack trace.");
      expect(serializedLogs).not.toContain("stack");
    } finally {
      await app.close();
    }
  });
});

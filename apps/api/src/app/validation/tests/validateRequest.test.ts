import { describe, expect, it } from "vitest";
import { z } from "zod";

import { RequestValidationError } from "../requestValidationError.js";
import { validateRequest } from "../validateRequest.js";

describe("validateRequest", () => {
  it("returns typed request data when the schema matches", () => {
    const schema = z.object({
      body: z.object({
        title: z.string().min(1),
      }),
      params: z.object({
        ticketId: z.uuid(),
      }),
      query: z.object({
        includeHistory: z.coerce.boolean(),
      }),
    });

    const result = validateRequest(schema, {
      body: {
        title: "Login issue",
      },
      params: {
        ticketId: "123e4567-e89b-12d3-a456-426614174000",
      },
      query: {
        includeHistory: "true",
      },
    });

    expect(result).toEqual({
      body: {
        title: "Login issue",
      },
      params: {
        ticketId: "123e4567-e89b-12d3-a456-426614174000",
      },
      query: {
        includeHistory: true,
      },
    });
  });

  it("throws a bad request API error when validation fails", () => {
    const schema = z.object({
      body: z.object({
        title: z.string().min(1),
      }),
    });

    expect(() =>
      validateRequest(schema, {
        body: {
          title: "",
        },
        params: {},
        query: {},
      }),
    ).toThrow(new RequestValidationError());
  });
});

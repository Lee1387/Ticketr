import type { FastifyRequest } from "fastify";
import type { z } from "zod";

import { RequestValidationError } from "./requestValidationError.js";

type RequestInput = Pick<FastifyRequest, "body" | "params" | "query">;

type RequestShape = {
  body: unknown;
  params: unknown;
  query: unknown;
};

export function validateRequest<TSchema extends z.ZodType>(
  schema: TSchema,
  request: RequestInput,
): z.infer<TSchema> {
  const result = schema.safeParse(toRequestShape(request));

  if (!result.success) {
    throw new RequestValidationError();
  }

  return result.data;
}

function toRequestShape(request: RequestInput): RequestShape {
  return {
    body: request.body,
    params: request.params,
    query: request.query,
  };
}

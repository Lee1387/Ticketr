import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { RequestValidationError } from "../validation/requestValidationError.js";
import { type ErrorResponse, unexpectedErrorResponse } from "./errorResponses.js";
import { getPublicErrorCode, isPublicFastifyError } from "./publicFastifyError.js";
import { getSafeErrorLogContext } from "./safeErrorLogContext.js";

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler(handleError);
}

function handleError(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  if (error instanceof RequestValidationError) {
    reply.status(400).send({
      error: {
        code: "BAD_REQUEST",
        message: error.message,
      },
    } satisfies ErrorResponse);
    return;
  }

  if (isPublicFastifyError(error)) {
    reply.status(error.statusCode).send({
      error: {
        code: getPublicErrorCode(error),
        message: error.message,
      },
    } satisfies ErrorResponse);
    return;
  }

  request.log.error(getSafeErrorLogContext(error), "Unhandled request error");
  reply.status(500).send(unexpectedErrorResponse);
}

import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { ApiError } from "./apiError.js";

type ErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

const unexpectedErrorResponse: ErrorResponse = {
  error: {
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
  },
};

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler(handleError);
}

function handleError(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  if (error instanceof ApiError) {
    reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
      },
    } satisfies ErrorResponse);
    return;
  }

  if (isFastifyClientError(error)) {
    reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
      },
    } satisfies ErrorResponse);
    return;
  }

  request.log.error({ err: error }, "Unhandled request error");
  reply.status(500).send(unexpectedErrorResponse);
}

function isFastifyClientError(
  error: FastifyError | Error,
): error is FastifyError & { statusCode: number } {
  return (
    "statusCode" in error &&
    typeof error.statusCode === "number" &&
    error.statusCode >= 400 &&
    error.statusCode < 500
  );
}

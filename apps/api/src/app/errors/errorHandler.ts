import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { RequestValidationError } from "../validation/requestValidationError.js";

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

const clientErrorCodeByStatusCode = new Map<number, string>([
  [400, "BAD_REQUEST"],
  [401, "UNAUTHORIZED"],
  [403, "FORBIDDEN"],
  [404, "NOT_FOUND"],
  [409, "CONFLICT"],
  [413, "PAYLOAD_TOO_LARGE"],
  [415, "UNSUPPORTED_MEDIA_TYPE"],
  [422, "UNPROCESSABLE_ENTITY"],
  [429, "TOO_MANY_REQUESTS"],
]);

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

  if (isFastifyClientError(error)) {
    reply.status(error.statusCode).send({
      error: {
        code: getClientErrorCode(error),
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

function getClientErrorCode(error: FastifyError & { statusCode: number }): string {
  const mappedCode = clientErrorCodeByStatusCode.get(error.statusCode);

  if (mappedCode !== undefined) {
    return mappedCode;
  }

  const code: unknown = error.code;

  if (typeof code === "string" && code.length > 0) {
    return code;
  }

  return "BAD_REQUEST";
}

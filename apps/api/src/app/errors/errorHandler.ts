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

const publicErrorCodeByStatusCode = new Map<number, string>([
  [400, "BAD_REQUEST"],
  [401, "UNAUTHORIZED"],
  [403, "FORBIDDEN"],
  [404, "NOT_FOUND"],
  [409, "CONFLICT"],
  [413, "PAYLOAD_TOO_LARGE"],
  [415, "UNSUPPORTED_MEDIA_TYPE"],
  [422, "UNPROCESSABLE_ENTITY"],
  [429, "TOO_MANY_REQUESTS"],
  [501, "NOT_IMPLEMENTED"],
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

function getSafeErrorLogContext(error: FastifyError | Error): {
  errorCode?: string;
  errorName: string;
} {
  const code: unknown = "code" in error ? error.code : undefined;

  if (typeof code === "string" && code.length > 0) {
    return {
      errorCode: code,
      errorName: error.name,
    };
  }

  return {
    errorName: error.name,
  };
}

function isPublicFastifyError(
  error: FastifyError | Error,
): error is FastifyError & { statusCode: number } {
  if (!("statusCode" in error) || typeof error.statusCode !== "number") {
    return false;
  }

  if (error.statusCode >= 400 && error.statusCode < 500) {
    return true;
  }

  return publicErrorCodeByStatusCode.has(error.statusCode);
}

function getPublicErrorCode(error: FastifyError & { statusCode: number }): string {
  const mappedCode = publicErrorCodeByStatusCode.get(error.statusCode);

  if (mappedCode !== undefined) {
    return mappedCode;
  }

  const code: unknown = error.code;

  return typeof code === "string" && code.length > 0 ? code : "BAD_REQUEST";
}

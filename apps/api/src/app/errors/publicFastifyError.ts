import type { FastifyError } from "fastify";

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

export function isPublicFastifyError(
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

export function getPublicErrorCode(error: FastifyError & { statusCode: number }): string {
  const mappedCode = publicErrorCodeByStatusCode.get(error.statusCode);

  if (mappedCode !== undefined) {
    return mappedCode;
  }

  const code: unknown = error.code;

  return typeof code === "string" && code.length > 0 ? code : "BAD_REQUEST";
}

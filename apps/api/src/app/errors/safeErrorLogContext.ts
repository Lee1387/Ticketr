import type { FastifyError } from "fastify";

export function getSafeErrorLogContext(error: FastifyError | Error): {
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

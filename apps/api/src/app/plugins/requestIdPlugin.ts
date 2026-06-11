import { randomUUID } from "node:crypto";
import type { IncomingMessage } from "node:http";

import type { FastifyInstance } from "fastify";

export const requestIdHeaderName = "x-request-id";

const requestIdPattern = /^[\w.:-]{1,128}$/u;

export function resolveRequestId(value: unknown): string {
  if (typeof value === "string" && requestIdPattern.test(value)) {
    return value;
  }

  return randomUUID();
}

export function buildRequestIdOptions(): {
  genReqId: (request: IncomingMessage) => string;
  requestIdHeader: false;
} {
  return {
    genReqId: (request) => resolveRequestId(request.headers[requestIdHeaderName]),
    requestIdHeader: false,
  };
}

export function registerRequestIdPlugin(app: FastifyInstance): void {
  app.addHook("onRequest", (request, reply, done) => {
    reply.header(requestIdHeaderName, request.id);
    done();
  });
}

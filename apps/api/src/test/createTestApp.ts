import type { FastifyInstance } from "fastify";

import type { AppServices } from "../app/appServices.js";
import { buildApp, type BuildAppOptions } from "../app/buildApp.js";
import { createTestServices } from "./createTestServices.js";

type CreateTestAppOptions = {
  jwtAudience?: string;
  jwtIssuer?: string;
  jwtSecret?: string;
  nodeEnv?: BuildAppOptions["nodeEnv"];
  services?: Partial<AppServices>;
};

export function createTestApp(options: CreateTestAppOptions = {}): FastifyInstance {
  return buildApp({
    jwtAudience: options.jwtAudience ?? "ticketr-api",
    jwtIssuer: options.jwtIssuer ?? "ticketr",
    jwtSecret: options.jwtSecret ?? "test-jwt-secret-with-at-least-thirty-two-characters",
    logger: false,
    nodeEnv: options.nodeEnv ?? "test",
    services: createTestServices(options.services),
  });
}

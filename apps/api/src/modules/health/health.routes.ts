import type { FastifyInstance } from "fastify";

type HealthResponse = {
  status: "ok";
};

export function registerHealthRoutes(app: FastifyInstance): void {
  app.get("/health", (): HealthResponse => {
    return {
      status: "ok",
    };
  });
}

import sensible from "@fastify/sensible";
import type { FastifyInstance } from "fastify";

export function registerSensiblePlugin(app: FastifyInstance): void {
  void app.register(sensible);
}

import { GenericContainer, type StartedTestContainer } from "testcontainers";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createRedisConnection } from "./client.js";

describe("createRedisConnection", () => {
  let container: StartedTestContainer | undefined;

  beforeAll(async () => {
    container = await new GenericContainer("redis:8-alpine")
      .withExposedPorts({ container: 6379, host: 0 })
      .withStartupTimeout(60_000)
      .start();
  });

  afterAll(async () => {
    await container?.stop();
  });

  it("connects to Redis and verifies the connection", async () => {
    if (container === undefined) {
      throw new Error("Redis test container was not started.");
    }

    const connection = createRedisConnection(
      `redis://${container.getHost()}:${String(container.getMappedPort(6379))}`,
    );

    try {
      await expect(connection.ping()).resolves.toBe("PONG");
    } finally {
      await connection.close();
    }
  });
});

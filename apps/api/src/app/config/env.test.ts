import { describe, expect, it } from "vitest";

import { parseEnv } from "./env.js";

describe("API environment config", () => {
  const databaseUrl = "postgres://ticketr:ticketr@localhost:5432/ticketr";
  const redisUrl = "redis://localhost:6379";
  const jwtSecret = "test-jwt-secret-with-at-least-thirty-two-characters";

  it("uses safe defaults", () => {
    expect(
      parseEnv({ DATABASE_URL: databaseUrl, REDIS_URL: redisUrl, JWT_SECRET: jwtSecret }),
    ).toEqual({
      NODE_ENV: "production",
      API_HOST: "0.0.0.0",
      API_PORT: 3000,
      DATABASE_URL: databaseUrl,
      REDIS_URL: redisUrl,
      JWT_AUDIENCE: "ticketr-api",
      JWT_ISSUER: "ticketr",
      JWT_SECRET: jwtSecret,
    });
  });

  it("parses explicit host and port values", () => {
    expect(
      parseEnv({
        NODE_ENV: "production",
        API_HOST: "127.0.0.1",
        API_PORT: "8080",
        DATABASE_URL: databaseUrl,
        REDIS_URL: redisUrl,
        JWT_AUDIENCE: "ticketr-web",
        JWT_ISSUER: "https://api.ticketr.test",
        JWT_SECRET: jwtSecret,
      }),
    ).toEqual({
      NODE_ENV: "production",
      API_HOST: "127.0.0.1",
      API_PORT: 8080,
      DATABASE_URL: databaseUrl,
      REDIS_URL: redisUrl,
      JWT_AUDIENCE: "ticketr-web",
      JWT_ISSUER: "https://api.ticketr.test",
      JWT_SECRET: jwtSecret,
    });
  });

  it("rejects invalid database URLs when provided", () => {
    expect(() =>
      parseEnv({
        DATABASE_URL: "not-a-database-url",
        REDIS_URL: redisUrl,
        JWT_SECRET: jwtSecret,
      }),
    ).toThrow();
  });

  it("requires database URLs to use the Postgres protocol", () => {
    expect(() =>
      parseEnv({
        DATABASE_URL: "https://localhost:5432/ticketr",
        REDIS_URL: redisUrl,
        JWT_SECRET: jwtSecret,
      }),
    ).toThrow();
  });

  it("requires a database URL", () => {
    expect(() => parseEnv({ REDIS_URL: redisUrl, JWT_SECRET: jwtSecret })).toThrow();
  });

  it("rejects invalid Redis URLs", () => {
    expect(() =>
      parseEnv({
        DATABASE_URL: databaseUrl,
        REDIS_URL: "not-a-redis-url",
        JWT_SECRET: jwtSecret,
      }),
    ).toThrow();
  });

  it("requires Redis URLs to use the Redis protocol", () => {
    expect(() =>
      parseEnv({
        DATABASE_URL: databaseUrl,
        REDIS_URL: "https://localhost:6379",
        JWT_SECRET: jwtSecret,
      }),
    ).toThrow();
  });

  it("requires a Redis URL", () => {
    expect(() => parseEnv({ DATABASE_URL: databaseUrl, JWT_SECRET: jwtSecret })).toThrow();
  });

  it("requires a strong JWT secret", () => {
    expect(() =>
      parseEnv({
        DATABASE_URL: databaseUrl,
        REDIS_URL: redisUrl,
        JWT_SECRET: "short",
      }),
    ).toThrow();
  });
});

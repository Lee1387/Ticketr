import { describe, expect, it } from "vitest";

import { parseEnv } from "./env.js";

describe("API environment config", () => {
  const databaseUrl = "postgres://ticketr:ticketr@localhost:5432/ticketr";

  it("uses safe local defaults", () => {
    expect(parseEnv({ DATABASE_URL: databaseUrl })).toEqual({
      NODE_ENV: "development",
      API_HOST: "0.0.0.0",
      API_PORT: 3000,
      DATABASE_URL: databaseUrl,
    });
  });

  it("parses explicit host and port values", () => {
    expect(
      parseEnv({
        NODE_ENV: "production",
        API_HOST: "127.0.0.1",
        API_PORT: "8080",
        DATABASE_URL: databaseUrl,
      }),
    ).toEqual({
      NODE_ENV: "production",
      API_HOST: "127.0.0.1",
      API_PORT: 8080,
      DATABASE_URL: databaseUrl,
    });
  });

  it("rejects invalid database URLs when provided", () => {
    expect(() =>
      parseEnv({
        DATABASE_URL: "not-a-database-url",
      }),
    ).toThrow();
  });

  it("requires a database URL", () => {
    expect(() => parseEnv({})).toThrow();
  });
});

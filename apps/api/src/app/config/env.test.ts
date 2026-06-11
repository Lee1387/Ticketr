import { describe, expect, it } from "vitest";

import { parseEnv } from "./env.js";

describe("API environment config", () => {
  it("uses safe local defaults", () => {
    expect(parseEnv({})).toEqual({
      NODE_ENV: "development",
      API_HOST: "0.0.0.0",
      API_PORT: 3000,
    });
  });

  it("parses explicit host and port values", () => {
    expect(
      parseEnv({
        NODE_ENV: "production",
        API_HOST: "127.0.0.1",
        API_PORT: "8080",
      }),
    ).toEqual({
      NODE_ENV: "production",
      API_HOST: "127.0.0.1",
      API_PORT: 8080,
    });
  });
});

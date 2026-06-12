import { describe, expect, it } from "vitest";

import { createDatabaseConnection } from "./client.js";

describe("createDatabaseConnection", () => {
  it("creates a typed database client with an explicit shutdown hook", async () => {
    const connection = createDatabaseConnection(
      "postgres://ticketr:ticketr@localhost:5432/ticketr",
    );

    try {
      expect(connection.db).toBeDefined();
      expect(connection.close).toEqual(expect.any(Function));
    } finally {
      await connection.close();
    }
  });
});

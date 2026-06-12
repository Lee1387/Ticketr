import { fileURLToPath } from "node:url";

import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  createDatabaseConnection,
  type DatabaseConnection,
} from "../../infrastructure/db/client.js";
import { organizationsTable } from "../../infrastructure/db/schema/organizations.js";
import { OrganizationsRepository } from "./organizations.repository.js";

const migrationsFolder = fileURLToPath(
  new URL("../../infrastructure/db/migrations/", import.meta.url),
);

describe("OrganizationsRepository integration", () => {
  let container: StartedPostgreSqlContainer | undefined;
  let connection: DatabaseConnection | undefined;

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:18.4-alpine")
      .withDatabase("ticketr_test")
      .withUsername("ticketr")
      .withPassword("ticketr")
      .start();

    connection = createDatabaseConnection(container.getConnectionUri());
    await migrate(connection.db, { migrationsFolder });
  }, 120_000);

  afterAll(async () => {
    await connection?.close();
    await container?.stop();
  }, 30_000);

  function getRepository(): OrganizationsRepository {
    if (connection === undefined) {
      throw new Error("Database connection was not initialized.");
    }

    return new OrganizationsRepository(connection.db);
  }

  it("finds an organization by id", async () => {
    if (connection === undefined) {
      throw new Error("Database connection was not initialized.");
    }

    const organizationId = "22222222-2222-4222-8222-222222222222";

    await connection.db.insert(organizationsTable).values({
      id: organizationId,
      name: "Acme Support",
      status: "active",
    });

    await expect(getRepository().findById(organizationId)).resolves.toMatchObject({
      id: organizationId,
      name: "Acme Support",
      status: "active",
    });
  });

  it("returns null for a missing organization", async () => {
    await expect(
      getRepository().findById("33333333-3333-4333-8333-333333333333"),
    ).resolves.toBeNull();
  });
});

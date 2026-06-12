import { fileURLToPath } from "node:url";

import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { createDatabaseConnection, type DatabaseConnection } from "../infrastructure/db/client.js";

const migrationsFolder = fileURLToPath(
  new URL("../infrastructure/db/migrations/", import.meta.url),
);

export type TestDatabase = {
  connection: DatabaseConnection;
  stop: () => Promise<void>;
};

export async function createTestDatabase(): Promise<TestDatabase> {
  const container = await new PostgreSqlContainer("postgres:18.4-alpine")
    .withDatabase("ticketr_test")
    .withUsername("ticketr")
    .withPassword("ticketr")
    .start();

  const connection = createDatabaseConnection(container.getConnectionUri());

  try {
    await migrate(connection.db, { migrationsFolder });
  } catch (error) {
    await closeTestDatabase(connection, container);
    throw error;
  }

  return {
    connection,
    stop: () => closeTestDatabase(connection, container),
  };
}

async function closeTestDatabase(
  connection: DatabaseConnection,
  container: StartedPostgreSqlContainer,
): Promise<void> {
  await connection.close();
  await container.stop();
}

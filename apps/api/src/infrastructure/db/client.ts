import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema/index.js";

const defaultConnectionOptions = {
  connect_timeout: 10,
  idle_timeout: 20,
  max: 10,
} satisfies postgres.Options<Record<string, postgres.PostgresType>>;

function createPostgresClient(databaseUrl: string): postgres.Sql {
  return postgres(databaseUrl, defaultConnectionOptions);
}

function createDrizzleClient(sql: postgres.Sql) {
  return drizzle(sql, { schema });
}

export type DatabaseConnection = {
  db: ReturnType<typeof createDrizzleClient>;
  close: () => Promise<void>;
};

export type DatabaseClient = DatabaseConnection["db"];

export function createDatabaseConnection(databaseUrl: string): DatabaseConnection {
  const sql = createPostgresClient(databaseUrl);

  return {
    db: createDrizzleClient(sql),
    close: () => sql.end(),
  };
}

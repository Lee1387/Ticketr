import { defineConfig } from "drizzle-kit";

import { postgresConnectionStringSchema } from "../../shared/config/connectionStringSchemas.js";

const databaseUrl = postgresConnectionStringSchema.parse(process.env["DATABASE_URL"]);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infrastructure/db/schema/index.ts",
  out: "./src/infrastructure/db/migrations",
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
});

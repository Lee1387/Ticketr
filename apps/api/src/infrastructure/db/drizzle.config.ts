import { defineConfig } from "drizzle-kit";
import { z } from "zod";

const databaseUrl = z.url().parse(process.env["DATABASE_URL"]);

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

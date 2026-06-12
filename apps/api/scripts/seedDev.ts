import { createDatabaseConnection } from "../src/infrastructure/db/client.js";
import { postgresConnectionStringSchema } from "../src/shared/config/connectionStringSchemas.js";
import { devSeedData, seedDevDatabase } from "./helpers/seed/seedDevData.js";

const databaseUrl = postgresConnectionStringSchema.parse(process.env["DATABASE_URL"]);
const connection = createDatabaseConnection(databaseUrl);

try {
  await seedDevDatabase(connection.db);
  process.stdout.write(
    `Seeded local development data for ${devSeedData.user.email} in ${devSeedData.organization.name}.\n`,
  );
} finally {
  await connection.close();
}

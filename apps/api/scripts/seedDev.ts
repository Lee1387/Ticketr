import { z } from "zod";

import { createDatabaseConnection } from "../src/infrastructure/db/client.js";
import { devSeedData, seedDevDatabase } from "./helpers/seedDevData.js";

const databaseUrl = z.url().parse(process.env["DATABASE_URL"]);
const connection = createDatabaseConnection(databaseUrl);

try {
  await seedDevDatabase(connection.db);
  process.stdout.write(
    `Seeded local development data for ${devSeedData.user.email} in ${devSeedData.organization.name}.\n`,
  );
} finally {
  await connection.close();
}

import { buildApp } from "./app/buildApp.js";
import { parseEnv } from "./app/config/env.js";
import { createDatabaseConnection } from "./infrastructure/db/client.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { OrganizationAccessService } from "./modules/organizations/organizationAccess.service.js";
import { OrganizationMembersRepository } from "./modules/organizations/organizationMembers.repository.js";
import { OrganizationsRepository } from "./modules/organizations/organizations.repository.js";
import { OrganizationsService } from "./modules/organizations/organizations.service.js";
import { TicketsRepository } from "./modules/tickets/tickets.repository.js";
import { TicketsService } from "./modules/tickets/tickets.service.js";
import { UsersRepository } from "./modules/users/users.repository.js";

const env = parseEnv(process.env);
const databaseConnection = createDatabaseConnection(env.DATABASE_URL);
const organizationMembersRepository = new OrganizationMembersRepository(databaseConnection.db);
const organizationsRepository = new OrganizationsRepository(databaseConnection.db);
const ticketsRepository = new TicketsRepository(databaseConnection.db);
const usersRepository = new UsersRepository(databaseConnection.db);
const authService = new AuthService(usersRepository);
const organizationAccessService = new OrganizationAccessService(organizationMembersRepository);
const organizationsService = new OrganizationsService(organizationsRepository);
const ticketsService = new TicketsService(organizationsRepository, ticketsRepository);
const app = buildApp({
  jwtAudience: env.JWT_AUDIENCE,
  jwtIssuer: env.JWT_ISSUER,
  jwtSecret: env.JWT_SECRET,
  nodeEnv: env.NODE_ENV,
  services: {
    authService,
    organizationAccessService,
    organizationsService,
    ticketsService,
  },
});

app.addHook("onClose", async () => {
  await databaseConnection.close();
});

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  app.log.info({ signal }, "Shutting down API server");
  await app.close();
};

process.once("SIGINT", (signal) => {
  void shutdown(signal);
});

process.once("SIGTERM", (signal) => {
  void shutdown(signal);
});

try {
  await app.listen({
    host: env.API_HOST,
    port: env.API_PORT,
  });
} catch (error) {
  app.log.error({ err: error }, "Failed to start API server");
  await app.close();
  process.exitCode = 1;
}

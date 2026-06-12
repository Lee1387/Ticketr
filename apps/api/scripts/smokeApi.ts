import { devSeedData } from "./helpers/seed/seedDevData.js";
import { smokeGetJson } from "./helpers/smoke/client/smokeApiClient.js";
import { runSmokeAuthFlow } from "./helpers/smoke/flows/smokeAuthFlow.js";
import { runSmokeInvitationFlow } from "./helpers/smoke/flows/smokeInvitationFlow.js";
import { runSmokeNegativeChecks } from "./helpers/smoke/flows/smokeNegativeChecks.js";
import { runSmokeOrganizationFlow } from "./helpers/smoke/flows/smokeOrganizationFlow.js";
import { runSmokeTicketFlow } from "./helpers/smoke/flows/smokeTicketFlow.js";
import {
  createSmokeResult,
  type SmokeResult,
  writeSmokeResults,
} from "./helpers/smoke/reporting/smokeResult.js";
import { healthResponseSchema } from "./helpers/smoke/schemas/smokeApiSchemas.js";

const organizationId = devSeedData.organization.id;

const results: SmokeResult[] = [];

const health = await smokeGetJson({
  name: "GET /health",
  path: "/health",
  schema: healthResponseSchema,
});
results.push(createSmokeResult("GET /health", health.statusCode, "status=ok"));

const authFlow = await runSmokeAuthFlow(organizationId);
results.push(...authFlow.results);
results.push(
  ...(await runSmokeOrganizationFlow({
    authorizationHeader: authFlow.authorizationHeader,
    organizationId,
  })),
);
results.push(
  ...(await runSmokeInvitationFlow({
    authorizationHeader: authFlow.authorizationHeader,
    organizationId,
  })),
);
results.push(
  ...(await runSmokeTicketFlow({
    authorizationHeader: authFlow.authorizationHeader,
    organizationId,
  })),
);
results.push(...(await runSmokeNegativeChecks(organizationId)));

writeSmokeResults(results);

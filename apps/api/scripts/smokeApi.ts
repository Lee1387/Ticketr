import { createDevelopmentToken } from "./helpers/devAuth.js";
import { devSeedData } from "./helpers/seedDevData.js";
import { smokeGetJson, smokeJson, smokeStatus } from "./helpers/smokeApiClient.js";
import {
  healthResponseSchema,
  organizationResponseSchema,
  ticketListResponseSchema,
  ticketResponseSchema,
} from "./helpers/smokeApiSchemas.js";

type SmokeResult = {
  detail: string;
  name: string;
  statusCode: number;
};

const organizationId = devSeedData.organization.id;

const results: SmokeResult[] = [];

const health = await smokeGetJson({
  name: "GET /health",
  path: "/health",
  schema: healthResponseSchema,
});
recordResult("GET /health", health.statusCode, "status=ok");

const developmentToken = await createDevelopmentToken();
recordResult("POST /auth/dev-token", 200, "tokenType=Bearer");

const authorizationHeader = `${developmentToken.tokenType} ${developmentToken.accessToken}`;

const organization = await smokeGetJson({
  authorizationHeader,
  name: "GET /organizations/:organizationId",
  path: `/organizations/${organizationId}`,
  schema: organizationResponseSchema,
});
recordResult(
  "GET /organizations/:organizationId",
  organization.statusCode,
  `name=${organization.data.organization.name}`,
);

const ticketList = await smokeGetJson({
  authorizationHeader,
  name: "GET /organizations/:organizationId/tickets",
  path: `/organizations/${organizationId}/tickets?limit=10`,
  schema: ticketListResponseSchema,
});
recordResult(
  "GET /organizations/:organizationId/tickets",
  ticketList.statusCode,
  `count=${String(ticketList.data.tickets.length)}`,
);

const createdTicket = await smokeJson({
  authorizationHeader,
  body: {
    description: "Created by the Ticketr API smoke script.",
    priority: "normal",
    subject: `Smoke test ticket ${new Date().toISOString()}`,
  },
  method: "POST",
  name: "POST /organizations/:organizationId/tickets",
  path: `/organizations/${organizationId}/tickets`,
  expectedStatusCode: 201,
  schema: ticketResponseSchema,
});
recordResult(
  "POST /organizations/:organizationId/tickets",
  createdTicket.statusCode,
  `ticketId=${createdTicket.data.ticket.id}`,
);

const readTicket = await smokeGetJson({
  authorizationHeader,
  name: "GET /organizations/:organizationId/tickets/:ticketId",
  path: `/organizations/${organizationId}/tickets/${createdTicket.data.ticket.id}`,
  schema: ticketResponseSchema,
});
recordResult(
  "GET /organizations/:organizationId/tickets/:ticketId",
  readTicket.statusCode,
  `status=${readTicket.data.ticket.status}`,
);

const updatedTicket = await smokeJson({
  authorizationHeader,
  body: {
    status: "pending",
  },
  method: "PATCH",
  name: "PATCH /organizations/:organizationId/tickets/:ticketId/status",
  path: `/organizations/${organizationId}/tickets/${createdTicket.data.ticket.id}/status`,
  expectedStatusCode: 200,
  schema: ticketResponseSchema,
});
recordResult(
  "PATCH /organizations/:organizationId/tickets/:ticketId/status",
  updatedTicket.statusCode,
  `status=${updatedTicket.data.ticket.status}`,
);

const unauthorizedStatusCode = await smokeStatus({
  expectedStatusCode: 401,
  name: "GET /organizations/:organizationId without auth",
  path: `/organizations/${organizationId}`,
});
recordResult(
  "GET /organizations/:organizationId without auth",
  unauthorizedStatusCode,
  "auth required",
);

const invalidOrganizationStatusCode = await smokeStatus({
  expectedStatusCode: 400,
  name: "GET /organizations/not-an-id",
  path: "/organizations/not-an-id",
});
recordResult(
  "GET /organizations/not-an-id",
  invalidOrganizationStatusCode,
  "request validation failed",
);

for (const result of results) {
  process.stdout.write(`${result.name}\t${String(result.statusCode)}\t${result.detail}\n`);
}

function recordResult(name: string, statusCode: number, detail: string): void {
  results.push({
    detail,
    name,
    statusCode,
  });
}

import { z } from "zod";

import { devSeedData } from "../src/infrastructure/db/seedDevData.js";
import { apiUrl, createDevelopmentToken } from "./devAuth.js";

type SmokeResult = {
  detail: string;
  name: string;
  statusCode: number;
};

type SmokeJsonResult<TData> = {
  data: TData;
  statusCode: number;
};

const organizationId = devSeedData.organization.id;

const healthResponseSchema = z.object({
  status: z.literal("ok"),
});

const organizationResponseSchema = z.object({
  organization: z.object({
    id: z.uuid(),
    name: z.string().min(1),
    status: z.string().min(1),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }),
});

const ticketResponseSchema = z.object({
  ticket: z.object({
    id: z.uuid(),
    organizationId: z.uuid(),
    subject: z.string().min(1),
    description: z.string().min(1),
    status: z.string().min(1),
    priority: z.string().min(1),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }),
});

const ticketListResponseSchema = z.object({
  tickets: z.array(ticketResponseSchema.shape.ticket),
});

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

await smokeStatus({
  expectedStatusCode: 401,
  detail: "auth required",
  name: "GET /organizations/:organizationId without auth",
  path: `/organizations/${organizationId}`,
});

await smokeStatus({
  expectedStatusCode: 400,
  detail: "request validation failed",
  name: "GET /organizations/not-an-id",
  path: "/organizations/not-an-id",
});

for (const result of results) {
  process.stdout.write(`${result.name}\t${String(result.statusCode)}\t${result.detail}\n`);
}

async function smokeGetJson<TSchema extends z.ZodType>(input: {
  authorizationHeader?: string;
  name: string;
  path: string;
  schema: TSchema;
}): Promise<SmokeJsonResult<z.infer<TSchema>>> {
  return smokeJson({
    ...input,
    method: "GET",
    expectedStatusCode: 200,
  });
}

async function smokeJson<TSchema extends z.ZodType>(input: {
  authorizationHeader?: string;
  body?: unknown;
  expectedStatusCode: number;
  method: "GET" | "PATCH" | "POST";
  name: string;
  path: string;
  schema: TSchema;
}): Promise<SmokeJsonResult<z.infer<TSchema>>> {
  const requestInit: RequestInit = {
    method: input.method,
    headers: buildHeaders(input.authorizationHeader),
  };

  if (input.body !== undefined) {
    requestInit.body = JSON.stringify(input.body);
  }

  const response = await fetch(new URL(input.path, apiUrl), requestInit);

  await assertStatus(response, input.expectedStatusCode, input.name);

  const responseBody: unknown = await response.json();
  const parsedResponse = input.schema.parse(responseBody);

  return {
    data: parsedResponse,
    statusCode: response.status,
  };
}

async function smokeStatus(input: {
  detail: string;
  expectedStatusCode: number;
  name: string;
  path: string;
}): Promise<void> {
  const response = await fetch(new URL(input.path, apiUrl));

  await assertStatus(response, input.expectedStatusCode, input.name);

  results.push({
    detail: input.detail,
    name: input.name,
    statusCode: response.status,
  });
}

async function assertStatus(
  response: Response,
  expectedStatusCode: number,
  name: string,
): Promise<void> {
  if (response.status === expectedStatusCode) {
    return;
  }

  const responseText = await response.text();
  throw new Error(
    `${name} expected ${String(expectedStatusCode)} but received ${String(
      response.status,
    )}: ${responseText}`,
  );
}

function buildHeaders(authorizationHeader: string | undefined): Headers {
  const headers = new Headers({
    "content-type": "application/json",
  });

  if (authorizationHeader !== undefined) {
    headers.set("authorization", authorizationHeader);
  }

  return headers;
}

function recordResult(name: string, statusCode: number, detail: string): void {
  results.push({
    detail,
    name,
    statusCode,
  });
}

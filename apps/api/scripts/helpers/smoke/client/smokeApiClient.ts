import type { z } from "zod";

import { apiUrl } from "../../auth/devAuth.js";
import { buildSmokeApiHeaders } from "./smokeApiHeaders.js";
import { assertSmokeApiStatus } from "./smokeApiStatus.js";

export type SmokeJsonResult<TData> = {
  data: TData;
  statusCode: number;
};

export async function smokeGetJson<TSchema extends z.ZodType>(input: {
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

export async function smokeJson<TSchema extends z.ZodType>(input: {
  authorizationHeader?: string;
  body?: unknown;
  expectedStatusCode: number;
  method: "DELETE" | "GET" | "PATCH" | "POST";
  name: string;
  path: string;
  schema: TSchema;
}): Promise<SmokeJsonResult<z.infer<TSchema>>> {
  const requestInit: RequestInit = {
    method: input.method,
    headers: buildSmokeApiHeaders({
      authorizationHeader: input.authorizationHeader,
      hasJsonBody: input.body !== undefined,
    }),
  };

  if (input.body !== undefined) {
    requestInit.body = JSON.stringify(input.body);
  }

  const response = await fetch(new URL(input.path, apiUrl), requestInit);

  await assertSmokeApiStatus({
    expectedStatusCode: input.expectedStatusCode,
    name: input.name,
    response,
  });

  const responseBody: unknown = await response.json();
  const parsedResponse = input.schema.parse(responseBody);

  return {
    data: parsedResponse,
    statusCode: response.status,
  };
}

export async function smokeStatus(input: {
  expectedStatusCode: number;
  name: string;
  path: string;
}): Promise<number> {
  const response = await fetch(new URL(input.path, apiUrl));

  await assertSmokeApiStatus({
    expectedStatusCode: input.expectedStatusCode,
    name: input.name,
    response,
  });

  return response.status;
}

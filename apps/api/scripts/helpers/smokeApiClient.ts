import type { z } from "zod";

import { apiUrl } from "./devAuth.js";

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

export async function smokeStatus(input: {
  expectedStatusCode: number;
  name: string;
  path: string;
}): Promise<number> {
  const response = await fetch(new URL(input.path, apiUrl));

  await assertStatus(response, input.expectedStatusCode, input.name);

  return response.status;
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

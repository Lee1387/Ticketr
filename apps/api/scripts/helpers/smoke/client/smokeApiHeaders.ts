export function buildSmokeApiHeaders(input: {
  authorizationHeader: string | undefined;
  hasJsonBody: boolean;
}): Headers {
  const headers = new Headers();

  if (input.hasJsonBody) {
    headers.set("content-type", "application/json");
  }

  if (input.authorizationHeader !== undefined) {
    headers.set("authorization", input.authorizationHeader);
  }

  return headers;
}

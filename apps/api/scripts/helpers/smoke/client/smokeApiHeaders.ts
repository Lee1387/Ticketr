export function buildSmokeApiHeaders(authorizationHeader: string | undefined): Headers {
  const headers = new Headers({
    "content-type": "application/json",
  });

  if (authorizationHeader !== undefined) {
    headers.set("authorization", authorizationHeader);
  }

  return headers;
}

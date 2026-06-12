export async function assertSmokeApiStatus(input: {
  expectedStatusCode: number;
  name: string;
  response: Response;
}): Promise<void> {
  if (input.response.status === input.expectedStatusCode) {
    return;
  }

  const responseText = await input.response.text();
  throw new Error(
    `${input.name} expected ${String(input.expectedStatusCode)} but received ${String(
      input.response.status,
    )}: ${responseText}`,
  );
}

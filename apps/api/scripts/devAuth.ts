import { z } from "zod";

import { devSeedData } from "../src/infrastructure/db/seedDevData.js";

const devTokenResponseSchema = z.object({
  accessToken: z.string().min(1),
  tokenType: z.literal("Bearer"),
});

export type DevelopmentToken = z.infer<typeof devTokenResponseSchema>;

export const apiUrl = z
  .url()
  .default("http://127.0.0.1:3000")
  .parse(process.env["TICKETR_API_URL"]);

export async function createDevelopmentToken(): Promise<DevelopmentToken> {
  const response = await fetch(new URL("/auth/dev-token", apiUrl), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      organizationId: devSeedData.organization.id,
      userId: devSeedData.user.id,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `Failed to create development token (${String(response.status)} ${
        response.statusText
      }): ${responseText}`,
    );
  }

  const responseBody: unknown = await response.json();
  return devTokenResponseSchema.parse(responseBody);
}

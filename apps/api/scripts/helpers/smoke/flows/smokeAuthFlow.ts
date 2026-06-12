import { createDevelopmentToken } from "../../auth/devAuth.js";
import { devSeedData } from "../../seed/seedDevData.js";
import { smokeJson } from "../client/smokeApiClient.js";
import { createSmokeResult, type SmokeResult } from "../reporting/smokeResult.js";
import { tokenResponseSchema } from "../schemas/smokeApiSchemas.js";

export type SmokeAuthFlowResult = {
  authorizationHeader: string;
  results: SmokeResult[];
};

export async function runSmokeAuthFlow(organizationId: string): Promise<SmokeAuthFlowResult> {
  const results: SmokeResult[] = [];
  const loginToken = await smokeJson({
    body: {
      email: devSeedData.user.email,
      organizationId,
      password: "Password123!",
    },
    method: "POST",
    name: "POST /auth/login",
    path: "/auth/login",
    expectedStatusCode: 200,
    schema: tokenResponseSchema,
  });
  results.push(createSmokeResult("POST /auth/login", loginToken.statusCode, "tokenType=Bearer"));

  const developmentToken = await createDevelopmentToken();
  results.push(
    createSmokeResult("POST /auth/dev-token", 200, `tokenType=${developmentToken.tokenType}`),
  );

  return {
    authorizationHeader: `${loginToken.data.tokenType} ${loginToken.data.accessToken}`,
    results,
  };
}

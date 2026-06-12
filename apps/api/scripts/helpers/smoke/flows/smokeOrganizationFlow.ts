import { smokeGetJson } from "../client/smokeApiClient.js";
import { createSmokeResult, type SmokeResult } from "../reporting/smokeResult.js";
import { organizationResponseSchema } from "../schemas/smokeApiSchemas.js";

type SmokeOrganizationFlowInput = {
  authorizationHeader: string;
  organizationId: string;
};

export async function runSmokeOrganizationFlow(
  input: SmokeOrganizationFlowInput,
): Promise<SmokeResult[]> {
  const organization = await smokeGetJson({
    authorizationHeader: input.authorizationHeader,
    name: "GET /organizations/:organizationId",
    path: `/organizations/${input.organizationId}`,
    schema: organizationResponseSchema,
  });

  return [
    createSmokeResult(
      "GET /organizations/:organizationId",
      organization.statusCode,
      `name=${organization.data.organization.name}`,
    ),
  ];
}

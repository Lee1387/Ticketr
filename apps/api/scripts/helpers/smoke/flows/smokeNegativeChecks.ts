import { smokeStatus } from "../client/smokeApiClient.js";
import { createSmokeResult, type SmokeResult } from "../reporting/smokeResult.js";

export async function runSmokeNegativeChecks(organizationId: string): Promise<SmokeResult[]> {
  const unauthorizedStatusCode = await smokeStatus({
    expectedStatusCode: 401,
    name: "GET /organizations/:organizationId without auth",
    path: `/organizations/${organizationId}`,
  });

  const invalidOrganizationStatusCode = await smokeStatus({
    expectedStatusCode: 400,
    name: "GET /organizations/not-an-id",
    path: "/organizations/not-an-id",
  });

  return [
    createSmokeResult(
      "GET /organizations/:organizationId without auth",
      unauthorizedStatusCode,
      "auth required",
    ),
    createSmokeResult(
      "GET /organizations/not-an-id",
      invalidOrganizationStatusCode,
      "request validation failed",
    ),
  ];
}

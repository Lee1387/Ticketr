import { devSeedData } from "../../seed/seedDevData.js";
import { smokeGetJson, smokeJson } from "../client/smokeApiClient.js";
import { createSmokeResult, type SmokeResult } from "../reporting/smokeResult.js";
import {
  organizationMemberListResponseSchema,
  organizationMemberRoleResponseSchema,
  organizationResponseSchema,
} from "../schemas/smokeApiSchemas.js";

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
  const members = await smokeGetJson({
    authorizationHeader: input.authorizationHeader,
    name: "GET /organizations/:organizationId/members",
    path: `/organizations/${input.organizationId}/members?limit=10`,
    schema: organizationMemberListResponseSchema,
  });
  const memberRole = await smokeJson({
    authorizationHeader: input.authorizationHeader,
    body: {
      role: devSeedData.membership.role,
    },
    expectedStatusCode: 200,
    method: "PATCH",
    name: "PATCH /organizations/:organizationId/members/:userId/role",
    path: `/organizations/${input.organizationId}/members/${devSeedData.user.id}/role`,
    schema: organizationMemberRoleResponseSchema,
  });

  return [
    createSmokeResult(
      "GET /organizations/:organizationId",
      organization.statusCode,
      `name=${organization.data.organization.name}`,
    ),
    createSmokeResult(
      "GET /organizations/:organizationId/members",
      members.statusCode,
      `count=${String(members.data.members.length)}`,
    ),
    createSmokeResult(
      "PATCH /organizations/:organizationId/members/:userId/role",
      memberRole.statusCode,
      `role=${memberRole.data.member.role}`,
    ),
  ];
}

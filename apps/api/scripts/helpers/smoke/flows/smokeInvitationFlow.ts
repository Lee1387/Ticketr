import { randomUUID } from "node:crypto";

import { smokeGetJson, smokeJson } from "../client/smokeApiClient.js";
import { createSmokeResult, type SmokeResult } from "../reporting/smokeResult.js";
import {
  invitationListResponseSchema,
  invitationResponseSchema,
} from "../schemas/smokeApiSchemas.js";

type SmokeInvitationFlowInput = {
  authorizationHeader: string;
  organizationId: string;
};

export async function runSmokeInvitationFlow(
  input: SmokeInvitationFlowInput,
): Promise<SmokeResult[]> {
  const results: SmokeResult[] = [];

  const initialInvitations = await smokeGetJson({
    authorizationHeader: input.authorizationHeader,
    name: "GET /organizations/:organizationId/invitations",
    path: `/organizations/${input.organizationId}/invitations?limit=10`,
    schema: invitationListResponseSchema,
  });
  results.push(
    createSmokeResult(
      "GET /organizations/:organizationId/invitations",
      initialInvitations.statusCode,
      `count=${String(initialInvitations.data.invitations.length)}`,
    ),
  );

  const createdInvitation = await smokeJson({
    authorizationHeader: input.authorizationHeader,
    body: {
      email: `smoke-${randomUUID()}@ticketr.local`,
      expiresAt: "2030-01-01T00:00:00.000Z",
      role: "agent",
    },
    method: "POST",
    name: "POST /organizations/:organizationId/invitations",
    path: `/organizations/${input.organizationId}/invitations`,
    expectedStatusCode: 201,
    schema: invitationResponseSchema,
  });
  results.push(
    createSmokeResult(
      "POST /organizations/:organizationId/invitations",
      createdInvitation.statusCode,
      `invitationId=${createdInvitation.data.invitation.id}`,
    ),
  );

  const pendingInvitations = await smokeGetJson({
    authorizationHeader: input.authorizationHeader,
    name: "GET /organizations/:organizationId/invitations after create",
    path: `/organizations/${input.organizationId}/invitations?limit=10`,
    schema: invitationListResponseSchema,
  });
  const createdInvitationIsPending = pendingInvitations.data.invitations.some(
    (invitation) => invitation.id === createdInvitation.data.invitation.id,
  );

  if (!createdInvitationIsPending) {
    throw new Error("Created invitation was not returned by the pending invitation list.");
  }

  results.push(
    createSmokeResult(
      "GET /organizations/:organizationId/invitations after create",
      pendingInvitations.statusCode,
      "created invitation pending",
    ),
  );

  const revokedInvitation = await smokeJson({
    authorizationHeader: input.authorizationHeader,
    method: "DELETE",
    name: "DELETE /organizations/:organizationId/invitations/:invitationId",
    path: `/organizations/${input.organizationId}/invitations/${createdInvitation.data.invitation.id}`,
    expectedStatusCode: 200,
    schema: invitationResponseSchema,
  });

  if (revokedInvitation.data.invitation.status !== "revoked") {
    throw new Error("Revoked invitation response did not have revoked status.");
  }

  results.push(
    createSmokeResult(
      "DELETE /organizations/:organizationId/invitations/:invitationId",
      revokedInvitation.statusCode,
      `status=${revokedInvitation.data.invitation.status}`,
    ),
  );

  const invitationsAfterRevoke = await smokeGetJson({
    authorizationHeader: input.authorizationHeader,
    name: "GET /organizations/:organizationId/invitations after revoke",
    path: `/organizations/${input.organizationId}/invitations?limit=10`,
    schema: invitationListResponseSchema,
  });
  const revokedInvitationIsPending = invitationsAfterRevoke.data.invitations.some(
    (invitation) => invitation.id === createdInvitation.data.invitation.id,
  );

  if (revokedInvitationIsPending) {
    throw new Error("Revoked invitation was returned by the pending invitation list.");
  }

  results.push(
    createSmokeResult(
      "GET /organizations/:organizationId/invitations after revoke",
      invitationsAfterRevoke.statusCode,
      "revoked invitation omitted",
    ),
  );

  return results;
}

import type { Invitation } from "../service/invitations.service.models.js";

export type InvitationResponse = {
  acceptedAt: string | null;
  createdAt: string;
  email: string;
  expiresAt: string;
  id: string;
  organizationId: string;
  role: string;
  status: string;
  updatedAt: string;
};

export function toInvitationResponse(invitation: Invitation): InvitationResponse {
  return {
    acceptedAt: invitation.acceptedAt?.toISOString() ?? null,
    createdAt: invitation.createdAt.toISOString(),
    email: invitation.email,
    expiresAt: invitation.expiresAt.toISOString(),
    id: invitation.id,
    organizationId: invitation.organizationId,
    role: invitation.role,
    status: invitation.status,
    updatedAt: invitation.updatedAt.toISOString(),
  };
}

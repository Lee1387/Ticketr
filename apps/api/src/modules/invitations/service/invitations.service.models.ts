import type { OrganizationId } from "../../organizations/domain/organizations.types.js";
import type {
  InvitationEmail,
  InvitationId,
  InvitationRole,
  InvitationStatus,
} from "../domain/invitations.types.js";

export type Invitation = {
  acceptedAt: Date | null;
  createdAt: Date;
  email: InvitationEmail;
  expiresAt: Date;
  id: InvitationId;
  organizationId: OrganizationId;
  role: InvitationRole;
  status: InvitationStatus;
  updatedAt: Date;
};

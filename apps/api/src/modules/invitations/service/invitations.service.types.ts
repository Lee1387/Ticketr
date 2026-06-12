import type { OrganizationId } from "../../organizations/domain/organizations.types.js";
import type { UserId } from "../../users/domain/users.types.js";
import type {
  InvitationEmail,
  InvitationId,
  InvitationRole,
  ListInvitationsQueryInput,
} from "../domain/invitations.types.js";
import type { Invitation } from "./invitations.service.models.js";

export type AcceptInvitationCommand = {
  invitationId: InvitationId;
  userId: UserId;
};

export type AcceptInvitationResult =
  | {
      status: "accepted";
      invitation: Invitation;
    }
  | {
      status: "not-found";
      message: string;
    }
  | {
      status: "conflict";
      message: string;
    };

export type CreateInvitationCommand = {
  email: InvitationEmail;
  expiresAt: Date;
  organizationId: OrganizationId;
  role: InvitationRole;
};

export type CreateInvitationResult =
  | {
      status: "created";
      invitation: Invitation;
    }
  | {
      status: "not-found";
      message: string;
    }
  | {
      status: "conflict";
      message: string;
    };

export type ListInvitationsQuery = {
  organizationId: OrganizationId;
  query: ListInvitationsQueryInput;
};

export type ListInvitationsResult =
  | {
      status: "found";
      invitations: Invitation[];
    }
  | {
      status: "not-found";
      message: string;
    };

export type RevokeInvitationCommand = {
  invitationId: InvitationId;
};

export type RevokeInvitationResult =
  | {
      status: "revoked";
      invitation: Invitation;
    }
  | {
      status: "not-found";
      message: string;
    };

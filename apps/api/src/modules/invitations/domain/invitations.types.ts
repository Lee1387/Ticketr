import type { z } from "zod";

import type {
  invitationEmailSchema,
  invitationIdSchema,
  invitationRoleSchema,
  invitationStatusSchema,
  listInvitationsQuerySchema,
} from "../domain/invitations.schemas.js";

export type InvitationId = z.infer<typeof invitationIdSchema>;

export type InvitationEmail = z.infer<typeof invitationEmailSchema>;

export type InvitationRole = z.infer<typeof invitationRoleSchema>;

export type InvitationStatus = z.infer<typeof invitationStatusSchema>;

export type ListInvitationsQueryInput = z.infer<typeof listInvitationsQuerySchema>;

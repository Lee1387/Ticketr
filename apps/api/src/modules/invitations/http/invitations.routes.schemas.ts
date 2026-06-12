import { z } from "zod";

import { organizationIdSchema } from "../../organizations/domain/organizations.schemas.js";
import {
  createInvitationSchema,
  invitationIdSchema,
  listInvitationsQuerySchema,
} from "../domain/invitations.schemas.js";

export const listInvitationsRequestSchema = z.object({
  body: z.undefined(),
  params: z.object({
    organizationId: organizationIdSchema,
  }),
  query: listInvitationsQuerySchema,
});

export const acceptInvitationRequestSchema = z.object({
  body: z.undefined(),
  params: z.object({
    invitationId: invitationIdSchema,
  }),
  query: z.object({}),
});

export const createInvitationRequestSchema = z.object({
  body: createInvitationSchema,
  params: z.object({
    organizationId: organizationIdSchema,
  }),
  query: z.object({}),
});

export const revokeInvitationRequestSchema = z.object({
  body: z.undefined(),
  params: z.object({
    invitationId: invitationIdSchema,
    organizationId: organizationIdSchema,
  }),
  query: z.object({}),
});

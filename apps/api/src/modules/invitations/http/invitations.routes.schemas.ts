import { z } from "zod";

import { organizationIdSchema } from "../../organizations/domain/organizations.schemas.js";
import { createInvitationSchema, invitationIdSchema } from "../domain/invitations.schemas.js";

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

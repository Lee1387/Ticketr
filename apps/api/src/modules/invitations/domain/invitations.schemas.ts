import { z } from "zod";

import { cursorPaginationQuerySchema } from "../../../shared/schemas/pagination.schemas.js";
import { organizationMemberRoleSchema } from "../../organizations/domain/organizations.schemas.js";
import { userEmailSchema } from "../../users/domain/users.schemas.js";
import { invitationStatusValues } from "../domain/invitations.constants.js";

export { invitationStatusValues };

export const invitationIdSchema = z.uuid();

export const invitationEmailSchema = userEmailSchema;

export const invitationRoleSchema = organizationMemberRoleSchema;

export const invitationStatusSchema = z.enum(invitationStatusValues);

export const listInvitationsQuerySchema = cursorPaginationQuerySchema;

export const createInvitationSchema = z.object({
  email: invitationEmailSchema,
  expiresAt: z.iso.datetime().transform((value) => new Date(value)),
  role: invitationRoleSchema,
});

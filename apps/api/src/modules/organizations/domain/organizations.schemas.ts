import { z } from "zod";

import { cursorPaginationQuerySchema } from "../../../shared/schemas/pagination.schemas.js";
import {
  organizationMemberRoleValues,
  organizationMemberStatusValues,
  organizationStatusValues,
} from "../domain/organizations.constants.js";

export { organizationMemberRoleValues, organizationMemberStatusValues, organizationStatusValues };

export const organizationIdSchema = z.uuid();

export const organizationStatusSchema = z.enum(organizationStatusValues);

export const organizationMemberRoleSchema = z.enum(organizationMemberRoleValues);

export const organizationMemberStatusSchema = z.enum(organizationMemberStatusValues);

export const listOrganizationMembersQuerySchema = cursorPaginationQuerySchema;

export const updateOrganizationMemberRoleSchema = z.object({
  role: organizationMemberRoleSchema,
});

import type { z } from "zod";

import type {
  listOrganizationMembersQuerySchema,
  organizationIdSchema,
  organizationMemberRoleSchema,
  organizationStatusSchema,
  updateOrganizationMemberRoleSchema,
} from "../domain/organizations.schemas.js";

export type OrganizationId = z.infer<typeof organizationIdSchema>;

export type OrganizationStatus = z.infer<typeof organizationStatusSchema>;

export type OrganizationMemberRole = z.infer<typeof organizationMemberRoleSchema>;

export type ListOrganizationMembersQueryInput = z.infer<typeof listOrganizationMembersQuerySchema>;

export type UpdateOrganizationMemberRoleInput = z.infer<typeof updateOrganizationMemberRoleSchema>;

import type { z } from "zod";

import type {
  organizationIdSchema,
  organizationMemberRoleSchema,
  organizationStatusSchema,
} from "./organizations.schemas.js";

export type OrganizationId = z.infer<typeof organizationIdSchema>;

export type OrganizationStatus = z.infer<typeof organizationStatusSchema>;

export type OrganizationMemberRole = z.infer<typeof organizationMemberRoleSchema>;

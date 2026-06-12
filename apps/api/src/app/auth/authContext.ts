import { z } from "zod";

import {
  organizationIdSchema,
  organizationMemberRoleSchema,
} from "../../modules/organizations/organizations.schemas.js";

export const authenticatedUserSchema = z.object({
  organizationId: organizationIdSchema,
  organizationRole: organizationMemberRoleSchema,
  userId: z.uuid(),
});

export const jwtAuthClaimsSchema = authenticatedUserSchema
  .extend({
    exp: z.number().int().positive(),
    iat: z.number().int().positive(),
  })
  .refine((claims) => claims.exp > claims.iat);

export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;

import { z } from "zod";

import { organizationIdSchema } from "../../modules/organizations/domain/organizations.schemas.js";
import { userIdSchema } from "../../modules/users/domain/users.schemas.js";

export const authenticatedUserSchema = z.object({
  organizationId: organizationIdSchema,
  userId: userIdSchema,
});

export const jwtAuthClaimsSchema = authenticatedUserSchema
  .extend({
    aud: z.string().min(1),
    exp: z.number().int().positive(),
    iat: z.number().int().positive(),
    iss: z.string().min(1),
  })
  .refine((claims) => claims.exp > claims.iat);

export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;

export type JwtAuthClaims = z.infer<typeof jwtAuthClaimsSchema>;

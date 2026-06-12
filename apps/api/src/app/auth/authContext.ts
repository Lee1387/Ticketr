import { z } from "zod";

import { organizationIdSchema } from "../../modules/organizations/organizations.schemas.js";

export const authenticatedUserSchema = z.object({
  organizationId: organizationIdSchema,
  userId: z.uuid(),
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

import { z } from "zod";

import { organizationIdSchema } from "../organizations/organizations.schemas.js";
import { userEmailSchema, userIdSchema } from "../users/users.schemas.js";

export const createDevelopmentTokenSchema = z.object({
  organizationId: organizationIdSchema,
  userId: userIdSchema,
});

export const loginSchema = z.object({
  email: userEmailSchema,
  organizationId: organizationIdSchema,
  password: z.string().min(1).max(1024),
});

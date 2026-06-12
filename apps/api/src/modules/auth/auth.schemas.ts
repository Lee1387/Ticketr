import { z } from "zod";

import { organizationIdSchema } from "../organizations/organizations.schemas.js";
import { userIdSchema } from "../users/users.schemas.js";

export const createDevelopmentTokenSchema = z.object({
  organizationId: organizationIdSchema,
  userId: userIdSchema,
});

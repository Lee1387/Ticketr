import type { z } from "zod";

import type { userEmailSchema, userIdSchema, userStatusSchema } from "./users.schemas.js";

export type UserId = z.infer<typeof userIdSchema>;

export type UserEmail = z.infer<typeof userEmailSchema>;

export type UserStatus = z.infer<typeof userStatusSchema>;

import { z } from "zod";

import { userStatusValues } from "./users.constants.js";

export { userStatusValues };

export const userIdSchema = z.uuid();

export const userEmailSchema = z.string().trim().toLowerCase().pipe(z.email().max(320));

export const userStatusSchema = z.enum(userStatusValues);

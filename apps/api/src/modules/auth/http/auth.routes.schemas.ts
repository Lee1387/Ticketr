import { z } from "zod";

import { createDevelopmentTokenSchema, loginSchema } from "../domain/auth.schemas.js";

export const createDevelopmentTokenRequestSchema = z.object({
  body: createDevelopmentTokenSchema,
  params: z.object({}),
  query: z.object({}),
});

export const loginRequestSchema = z.object({
  body: loginSchema,
  params: z.object({}),
  query: z.object({}),
});

import { z } from "zod";

export const cursorPaginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  createdBefore: z.iso
    .datetime()
    .transform((value) => new Date(value))
    .optional(),
});

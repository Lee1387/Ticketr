import { z } from "zod";

import { ticketPriorityValues, ticketStatusValues } from "./tickets.constants.js";

export { ticketPriorityValues, ticketStatusValues };

export const ticketStatusSchema = z.enum(ticketStatusValues);

export const ticketPrioritySchema = z.enum(ticketPriorityValues);

export const ticketIdSchema = z.uuid();

export const listTicketsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  createdBefore: z.iso
    .datetime()
    .transform((value) => new Date(value))
    .optional(),
});

export const createTicketSchema = z.object({
  subject: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(10_000),
  priority: ticketPrioritySchema.default("normal"),
});

export const updateTicketStatusSchema = z.object({
  status: ticketStatusSchema,
});

import { z } from "zod";

import { cursorPaginationQuerySchema } from "../../../shared/schemas/pagination.schemas.js";
import { ticketPriorityValues, ticketStatusValues } from "../domain/tickets.constants.js";

export { ticketPriorityValues, ticketStatusValues };

export const ticketStatusSchema = z.enum(ticketStatusValues);

export const ticketPrioritySchema = z.enum(ticketPriorityValues);

export const ticketIdSchema = z.uuid();

export const listTicketsQuerySchema = cursorPaginationQuerySchema;

export const createTicketSchema = z.object({
  subject: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(10_000),
  priority: ticketPrioritySchema.default("normal"),
});

export const updateTicketStatusSchema = z.object({
  status: ticketStatusSchema,
});

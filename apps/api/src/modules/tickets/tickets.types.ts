import type { z } from "zod";

import type {
  createTicketSchema,
  listTicketsQuerySchema,
  ticketIdSchema,
  ticketPrioritySchema,
  ticketStatusSchema,
} from "./tickets.schemas.js";

export type TicketId = z.infer<typeof ticketIdSchema>;

export type TicketStatus = z.infer<typeof ticketStatusSchema>;

export type TicketPriority = z.infer<typeof ticketPrioritySchema>;

export type ListTicketsQueryInput = z.infer<typeof listTicketsQuerySchema>;

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

import type { z } from "zod";

import type {
  createTicketSchema,
  ticketPrioritySchema,
  ticketStatusSchema,
} from "./tickets.schemas.js";

export type TicketStatus = z.infer<typeof ticketStatusSchema>;

export type TicketPriority = z.infer<typeof ticketPrioritySchema>;

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

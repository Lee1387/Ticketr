import { z } from "zod";

import { organizationIdSchema } from "../organizations/organizations.schemas.js";
import {
  createTicketSchema,
  listTicketsQuerySchema,
  ticketIdSchema,
  updateTicketStatusSchema,
} from "./tickets.schemas.js";

export const listTicketsRequestSchema = z.object({
  body: z.undefined(),
  params: z.object({
    organizationId: organizationIdSchema,
  }),
  query: listTicketsQuerySchema,
});

export const getTicketRequestSchema = z.object({
  body: z.undefined(),
  params: z.object({
    organizationId: organizationIdSchema,
    ticketId: ticketIdSchema,
  }),
  query: z.object({}),
});

export const createTicketRequestSchema = z.object({
  body: createTicketSchema,
  params: z.object({
    organizationId: organizationIdSchema,
  }),
  query: z.object({}),
});

export const updateTicketStatusRequestSchema = z.object({
  body: updateTicketStatusSchema,
  params: z.object({
    organizationId: organizationIdSchema,
    ticketId: ticketIdSchema,
  }),
  query: z.object({}),
});

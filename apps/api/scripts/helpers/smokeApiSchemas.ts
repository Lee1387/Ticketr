import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
});

export const organizationResponseSchema = z.object({
  organization: z.object({
    id: z.uuid(),
    name: z.string().min(1),
    status: z.string().min(1),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }),
});

export const ticketResponseSchema = z.object({
  ticket: z.object({
    id: z.uuid(),
    organizationId: z.uuid(),
    subject: z.string().min(1),
    description: z.string().min(1),
    status: z.string().min(1),
    priority: z.string().min(1),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }),
});

export const ticketListResponseSchema = z.object({
  tickets: z.array(ticketResponseSchema.shape.ticket),
});

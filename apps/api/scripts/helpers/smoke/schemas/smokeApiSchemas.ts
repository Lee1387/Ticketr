import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
});

export const tokenResponseSchema = z.object({
  accessToken: z.string().min(1),
  tokenType: z.literal("Bearer"),
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

export const organizationMemberListResponseSchema = z.object({
  members: z.array(
    z.object({
      createdAt: z.iso.datetime(),
      email: z.email(),
      name: z.string().min(1),
      role: z.string().min(1),
      status: z.string().min(1),
      userId: z.uuid(),
    }),
  ),
});

export const invitationResponseSchema = z.object({
  invitation: z.object({
    acceptedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    email: z.email(),
    expiresAt: z.iso.datetime(),
    id: z.uuid(),
    organizationId: z.uuid(),
    role: z.string().min(1),
    status: z.string().min(1),
    updatedAt: z.iso.datetime(),
  }),
});

export const invitationListResponseSchema = z.object({
  invitations: z.array(invitationResponseSchema.shape.invitation),
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

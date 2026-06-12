import type { Ticket } from "./tickets.service.types.js";

export type TicketResponse = {
  id: string;
  organizationId: string;
  subject: string;
  description: string;
  status: Ticket["status"];
  priority: Ticket["priority"];
  createdAt: string;
  updatedAt: string;
};

export function toTicketResponse(ticket: Ticket): TicketResponse {
  return {
    id: ticket.id,
    organizationId: ticket.organizationId,
    subject: ticket.subject,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  };
}

import type { OrganizationId } from "../../organizations/domain/organizations.types.js";
import type { TicketPriority, TicketStatus } from "../domain/tickets.types.js";

export type Ticket = {
  id: string;
  organizationId: OrganizationId;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
};

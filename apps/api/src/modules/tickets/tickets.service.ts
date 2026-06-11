import type { OrganizationId } from "../organizations/organizations.types.js";
import type { CreateTicketInput } from "./tickets.types.js";

export const ticketCreationNotImplementedMessage = "Ticket creation is not implemented yet.";

export type CreateTicketCommand = {
  organizationId: OrganizationId;
  input: CreateTicketInput;
};

export type CreateTicketResult = {
  status: "not-implemented";
  message: string;
};

export class TicketsService {
  createTicket(command: CreateTicketCommand): CreateTicketResult {
    void command;

    return {
      status: "not-implemented",
      message: ticketCreationNotImplementedMessage,
    };
  }
}

import type { OrganizationId } from "../organizations/organizations.types.js";
import type { CreateTicketInput } from "./tickets.types.js";

export const ticketCreationNotImplementedMessage = "Ticket creation is not implemented yet.";
export const ticketOrganizationNotFoundMessage = "Organization was not found.";

export type OrganizationLookup = {
  findById: (id: OrganizationId) => Promise<{ id: OrganizationId } | null>;
};

export type CreateTicketCommand = {
  organizationId: OrganizationId;
  input: CreateTicketInput;
};

export type CreateTicketResult =
  | {
      status: "not-found";
      message: string;
    }
  | {
      status: "not-implemented";
      message: string;
    };

export class TicketsService {
  constructor(private readonly organizationLookup: OrganizationLookup) {}

  async createTicket(command: CreateTicketCommand): Promise<CreateTicketResult> {
    void command.input;

    const organization = await this.organizationLookup.findById(command.organizationId);

    if (organization === null) {
      return {
        status: "not-found",
        message: ticketOrganizationNotFoundMessage,
      };
    }

    return {
      status: "not-implemented",
      message: ticketCreationNotImplementedMessage,
    };
  }
}

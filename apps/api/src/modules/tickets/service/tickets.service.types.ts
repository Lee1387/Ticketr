import type { OrganizationId } from "../../organizations/domain/organizations.types.js";
import type {
  CreateTicketInput,
  ListTicketsQueryInput,
  TicketId,
  UpdateTicketStatusInput,
} from "../domain/tickets.types.js";
import type { Ticket } from "./tickets.service.models.js";

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
      status: "created";
      ticket: Ticket;
    };

export type GetTicketQuery = {
  organizationId: OrganizationId;
  ticketId: TicketId;
};

export type GetTicketResult =
  | {
      status: "not-found";
      message: string;
    }
  | {
      status: "found";
      ticket: Ticket;
    };

export type ListTicketsQuery = {
  organizationId: OrganizationId;
  query: ListTicketsQueryInput;
};

export type ListTicketsResult =
  | {
      status: "not-found";
      message: string;
    }
  | {
      status: "found";
      tickets: Ticket[];
    };

export type UpdateTicketStatusCommand = {
  organizationId: OrganizationId;
  ticketId: TicketId;
  input: UpdateTicketStatusInput;
};

export type UpdateTicketStatusResult =
  | {
      status: "not-found";
      message: string;
    }
  | {
      status: "conflict";
      message: string;
    }
  | {
      status: "updated";
      ticket: Ticket;
    };

import type { OrganizationId } from "../organizations/organizations.types.js";
import type {
  CreateTicketInput,
  ListTicketsQueryInput,
  TicketId,
  TicketPriority,
  TicketStatus,
} from "./tickets.types.js";

export const ticketOrganizationNotFoundMessage = "Organization was not found.";
export const ticketNotFoundMessage = "Ticket was not found.";

export type OrganizationLookup = {
  findById: (id: OrganizationId) => Promise<{ id: OrganizationId } | null>;
};

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

export type TicketCreator = {
  create: (input: {
    organizationId: OrganizationId;
    subject: string;
    description: string;
    priority: TicketPriority;
  }) => Promise<Ticket>;
};

export type TicketLookup = {
  findByOrganizationIdAndId: (input: {
    id: TicketId;
    organizationId: OrganizationId;
  }) => Promise<Ticket | null>;
};

export type TicketLister = {
  listByOrganizationId: (input: {
    organizationId: OrganizationId;
    limit: number;
    createdBefore?: Date;
  }) => Promise<Ticket[]>;
};

export type TicketsRepositoryPort = TicketCreator & TicketLister & TicketLookup;

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

export class TicketsService {
  constructor(
    private readonly organizationLookup: OrganizationLookup,
    private readonly ticketsRepository: TicketsRepositoryPort,
  ) {}

  async listTickets(query: ListTicketsQuery): Promise<ListTicketsResult> {
    const organization = await this.organizationLookup.findById(query.organizationId);

    if (organization === null) {
      return {
        status: "not-found",
        message: ticketOrganizationNotFoundMessage,
      };
    }

    const tickets = await this.ticketsRepository.listByOrganizationId({
      organizationId: query.organizationId,
      limit: query.query.limit,
      ...(query.query.createdBefore === undefined
        ? {}
        : { createdBefore: query.query.createdBefore }),
    });

    return {
      status: "found",
      tickets,
    };
  }

  async getTicket(query: GetTicketQuery): Promise<GetTicketResult> {
    const ticket = await this.ticketsRepository.findByOrganizationIdAndId({
      id: query.ticketId,
      organizationId: query.organizationId,
    });

    if (ticket === null) {
      return {
        status: "not-found",
        message: ticketNotFoundMessage,
      };
    }

    return {
      status: "found",
      ticket,
    };
  }

  async createTicket(command: CreateTicketCommand): Promise<CreateTicketResult> {
    const organization = await this.organizationLookup.findById(command.organizationId);

    if (organization === null) {
      return {
        status: "not-found",
        message: ticketOrganizationNotFoundMessage,
      };
    }

    const ticket = await this.ticketsRepository.create({
      organizationId: command.organizationId,
      subject: command.input.subject,
      description: command.input.description,
      priority: command.input.priority,
    });

    return {
      status: "created",
      ticket,
    };
  }
}

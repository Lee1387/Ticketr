import type { OrganizationId } from "../organizations/organizations.types.js";
import { canTransitionTicketStatus } from "./tickets.policy.js";
import type {
  CreateTicketInput,
  ListTicketsQueryInput,
  TicketId,
  TicketPriority,
  TicketStatus,
  UpdateTicketStatusInput,
} from "./tickets.types.js";

export const ticketOrganizationNotFoundMessage = "Organization was not found.";
export const ticketNotFoundMessage = "Ticket was not found.";
export const ticketStatusTransitionNotAllowedMessage = "Ticket status transition is not allowed.";
export const ticketStatusChangedBeforeUpdateMessage =
  "Ticket status changed before it could be updated.";

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

export type TicketStatusUpdater = {
  updateStatusByOrganizationIdAndId: (input: {
    currentStatus: TicketStatus;
    id: TicketId;
    organizationId: OrganizationId;
    status: TicketStatus;
  }) => Promise<Ticket | null>;
};

export type TicketLister = {
  listByOrganizationId: (input: {
    organizationId: OrganizationId;
    limit: number;
    createdBefore?: Date;
  }) => Promise<Ticket[]>;
};

export type TicketsRepositoryPort = TicketCreator &
  TicketLister &
  TicketLookup &
  TicketStatusUpdater;

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

  async updateTicketStatus(command: UpdateTicketStatusCommand): Promise<UpdateTicketStatusResult> {
    const currentTicket = await this.ticketsRepository.findByOrganizationIdAndId({
      id: command.ticketId,
      organizationId: command.organizationId,
    });

    if (currentTicket === null) {
      return {
        status: "not-found",
        message: ticketNotFoundMessage,
      };
    }

    const canTransition = canTransitionTicketStatus({
      from: currentTicket.status,
      to: command.input.status,
    });

    if (!canTransition) {
      return {
        status: "conflict",
        message: ticketStatusTransitionNotAllowedMessage,
      };
    }

    const updatedTicket = await this.ticketsRepository.updateStatusByOrganizationIdAndId({
      currentStatus: currentTicket.status,
      id: command.ticketId,
      organizationId: command.organizationId,
      status: command.input.status,
    });

    if (updatedTicket === null) {
      return {
        status: "conflict",
        message: ticketStatusChangedBeforeUpdateMessage,
      };
    }

    return {
      status: "updated",
      ticket: updatedTicket,
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

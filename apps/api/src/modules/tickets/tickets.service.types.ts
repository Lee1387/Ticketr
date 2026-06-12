import type { OrganizationId } from "../organizations/organizations.types.js";
import type {
  CreateTicketInput,
  ListTicketsQueryInput,
  TicketId,
  TicketPriority,
  TicketStatus,
  UpdateTicketStatusInput,
} from "./tickets.types.js";

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

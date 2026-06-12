import type { OrganizationId } from "../../organizations/domain/organizations.types.js";
import type { TicketId, TicketPriority, TicketStatus } from "../domain/tickets.types.js";
import type { Ticket } from "./tickets.service.models.js";

export type OrganizationLookup = {
  findById: (id: OrganizationId) => Promise<{ id: OrganizationId } | null>;
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

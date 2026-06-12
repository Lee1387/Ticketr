import type {
  CreateTicketCommand,
  CreateTicketResult,
  GetTicketQuery,
  GetTicketResult,
  ListTicketsQuery,
  ListTicketsResult,
  UpdateTicketStatusCommand,
  UpdateTicketStatusResult,
} from "./tickets.service.types.js";
import type { OrganizationLookup, TicketsRepositoryPort } from "./tickets.service.ports.js";
import { createTicket } from "./createTicket.service.js";
import { getTicket } from "./getTicket.service.js";
import { listTickets } from "./listTickets.service.js";
import { updateTicketStatus } from "./updateTicketStatus.service.js";

export class TicketsService {
  constructor(
    private readonly organizationLookup: OrganizationLookup,
    private readonly ticketsRepository: TicketsRepositoryPort,
  ) {}

  async listTickets(query: ListTicketsQuery): Promise<ListTicketsResult> {
    return listTickets(query, {
      organizationLookup: this.organizationLookup,
      ticketsRepository: this.ticketsRepository,
    });
  }

  async getTicket(query: GetTicketQuery): Promise<GetTicketResult> {
    return getTicket(query, {
      ticketsRepository: this.ticketsRepository,
    });
  }

  async updateTicketStatus(command: UpdateTicketStatusCommand): Promise<UpdateTicketStatusResult> {
    return updateTicketStatus(command, {
      ticketsRepository: this.ticketsRepository,
    });
  }

  async createTicket(command: CreateTicketCommand): Promise<CreateTicketResult> {
    return createTicket(command, {
      organizationLookup: this.organizationLookup,
      ticketsRepository: this.ticketsRepository,
    });
  }
}

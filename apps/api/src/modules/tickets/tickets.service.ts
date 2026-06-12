import { canTransitionTicketStatus } from "./tickets.policy.js";
import {
  ticketNotFoundMessage,
  ticketOrganizationNotFoundMessage,
  ticketStatusChangedBeforeUpdateMessage,
  ticketStatusTransitionNotAllowedMessage,
} from "./tickets.constants.js";
import type {
  CreateTicketCommand,
  CreateTicketResult,
  GetTicketQuery,
  GetTicketResult,
  ListTicketsQuery,
  ListTicketsResult,
  OrganizationLookup,
  TicketsRepositoryPort,
  UpdateTicketStatusCommand,
  UpdateTicketStatusResult,
} from "./tickets.service.types.js";

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

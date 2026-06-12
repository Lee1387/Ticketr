import {
  ticketNotFoundMessage,
  ticketStatusChangedBeforeUpdateMessage,
  ticketStatusTransitionNotAllowedMessage,
} from "../domain/tickets.constants.js";
import { canTransitionTicketStatus } from "../domain/tickets.policy.js";
import type { TicketLookup, TicketStatusUpdater } from "./tickets.service.ports.js";
import type {
  UpdateTicketStatusCommand,
  UpdateTicketStatusResult,
} from "./tickets.service.types.js";

type UpdateTicketStatusDependencies = {
  ticketsRepository: TicketLookup & TicketStatusUpdater;
};

export async function updateTicketStatus(
  command: UpdateTicketStatusCommand,
  dependencies: UpdateTicketStatusDependencies,
): Promise<UpdateTicketStatusResult> {
  const currentTicket = await dependencies.ticketsRepository.findByOrganizationIdAndId({
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

  const updatedTicket = await dependencies.ticketsRepository.updateStatusByOrganizationIdAndId({
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

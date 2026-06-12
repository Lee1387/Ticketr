import { describe, expect, it, vi } from "vitest";

import {
  ticketNotFoundMessage,
  ticketStatusChangedBeforeUpdateMessage,
  ticketStatusTransitionNotAllowedMessage,
} from "../tickets.constants.js";
import { TicketsService } from "../tickets.service.js";
import {
  createServiceTestTicketsRepository,
  existingOrganizationLookup,
  serviceTestOrganizationId,
  serviceTestTicket,
} from "./tickets.service.testUtils.js";

describe("TicketsService updateTicketStatus", () => {
  it("updates a ticket status within an organization", async () => {
    const updatedTicket = {
      ...serviceTestTicket,
      status: "pending" as const,
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    };
    const ticketsRepository = createServiceTestTicketsRepository({
      findByOrganizationIdAndId: vi.fn(() => Promise.resolve(serviceTestTicket)),
      updateStatusByOrganizationIdAndId: vi.fn(() => Promise.resolve(updatedTicket)),
    });
    const service = new TicketsService(existingOrganizationLookup, ticketsRepository);

    const result = await service.updateTicketStatus({
      organizationId: serviceTestOrganizationId,
      ticketId: serviceTestTicket.id,
      input: {
        status: "pending",
      },
    });

    expect(result).toEqual({
      status: "updated",
      ticket: updatedTicket,
    });
    expect(ticketsRepository.findByOrganizationIdAndId).toHaveBeenCalledWith({
      id: serviceTestTicket.id,
      organizationId: serviceTestOrganizationId,
    });
    expect(ticketsRepository.updateStatusByOrganizationIdAndId).toHaveBeenCalledWith({
      currentStatus: "open",
      id: serviceTestTicket.id,
      organizationId: serviceTestOrganizationId,
      status: "pending",
    });
  });

  it("reports a missing ticket when updating status", async () => {
    const ticketsRepository = createServiceTestTicketsRepository();
    const service = new TicketsService(existingOrganizationLookup, ticketsRepository);

    const result = await service.updateTicketStatus({
      organizationId: serviceTestOrganizationId,
      ticketId: serviceTestTicket.id,
      input: {
        status: "pending",
      },
    });

    expect(result).toEqual({
      status: "not-found",
      message: ticketNotFoundMessage,
    });
    expect(ticketsRepository.updateStatusByOrganizationIdAndId).not.toHaveBeenCalled();
  });

  it("reports a conflict when the ticket status changes before update", async () => {
    const ticketsRepository = createServiceTestTicketsRepository({
      findByOrganizationIdAndId: vi.fn(() => Promise.resolve(serviceTestTicket)),
      updateStatusByOrganizationIdAndId: vi.fn(() => Promise.resolve(null)),
    });
    const service = new TicketsService(existingOrganizationLookup, ticketsRepository);

    const result = await service.updateTicketStatus({
      organizationId: serviceTestOrganizationId,
      ticketId: serviceTestTicket.id,
      input: {
        status: "pending",
      },
    });

    expect(result).toEqual({
      status: "conflict",
      message: ticketStatusChangedBeforeUpdateMessage,
    });
  });

  it("rejects unsupported ticket status transitions", async () => {
    const closedTicket = {
      ...serviceTestTicket,
      status: "closed" as const,
    };
    const ticketsRepository = createServiceTestTicketsRepository({
      findByOrganizationIdAndId: vi.fn(() => Promise.resolve(closedTicket)),
      updateStatusByOrganizationIdAndId: vi.fn(() => Promise.resolve(serviceTestTicket)),
    });
    const service = new TicketsService(existingOrganizationLookup, ticketsRepository);

    const result = await service.updateTicketStatus({
      organizationId: serviceTestOrganizationId,
      ticketId: serviceTestTicket.id,
      input: {
        status: "resolved",
      },
    });

    expect(result).toEqual({
      status: "conflict",
      message: ticketStatusTransitionNotAllowedMessage,
    });
    expect(ticketsRepository.updateStatusByOrganizationIdAndId).not.toHaveBeenCalled();
  });
});

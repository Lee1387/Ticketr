import { describe, expect, it, vi } from "vitest";

import { ticketNotFoundMessage, ticketOrganizationNotFoundMessage } from "../tickets.constants.js";
import { TicketsService } from "../tickets.service.js";
import {
  createServiceTestTicketsRepository,
  existingOrganizationLookup,
  missingOrganizationLookup,
  serviceTestOrganizationId,
  serviceTestTicket,
} from "./tickets.service.testUtils.js";

describe("TicketsService read use cases", () => {
  it("returns a ticket scoped to an organization", async () => {
    const ticketsRepository = createServiceTestTicketsRepository({
      findByOrganizationIdAndId: vi.fn(() => Promise.resolve(serviceTestTicket)),
    });
    const service = new TicketsService(existingOrganizationLookup, ticketsRepository);

    const result = await service.getTicket({
      organizationId: serviceTestOrganizationId,
      ticketId: serviceTestTicket.id,
    });

    expect(result).toEqual({
      status: "found",
      ticket: serviceTestTicket,
    });
    expect(ticketsRepository.findByOrganizationIdAndId).toHaveBeenCalledWith({
      id: serviceTestTicket.id,
      organizationId: serviceTestOrganizationId,
    });
  });

  it("reports a missing ticket", async () => {
    const ticketsRepository = createServiceTestTicketsRepository();
    const service = new TicketsService(existingOrganizationLookup, ticketsRepository);

    const result = await service.getTicket({
      organizationId: serviceTestOrganizationId,
      ticketId: serviceTestTicket.id,
    });

    expect(result).toEqual({
      status: "not-found",
      message: ticketNotFoundMessage,
    });
  });

  it("lists tickets for an existing organization", async () => {
    const createdBefore = new Date("2026-01-02T00:00:00.000Z");
    const ticketsRepository = createServiceTestTicketsRepository({
      listByOrganizationId: vi.fn(() => Promise.resolve([serviceTestTicket])),
    });
    const service = new TicketsService(existingOrganizationLookup, ticketsRepository);

    const result = await service.listTickets({
      organizationId: serviceTestOrganizationId,
      query: {
        limit: 10,
        createdBefore,
      },
    });

    expect(result).toEqual({
      status: "found",
      tickets: [serviceTestTicket],
    });
    expect(ticketsRepository.listByOrganizationId).toHaveBeenCalledWith({
      organizationId: serviceTestOrganizationId,
      limit: 10,
      createdBefore,
    });
  });

  it("reports a missing organization before listing tickets", async () => {
    const ticketsRepository = createServiceTestTicketsRepository({
      listByOrganizationId: vi.fn(() => Promise.resolve([serviceTestTicket])),
    });
    const service = new TicketsService(missingOrganizationLookup, ticketsRepository);

    const result = await service.listTickets({
      organizationId: serviceTestOrganizationId,
      query: {
        limit: 10,
      },
    });

    expect(result).toEqual({
      status: "not-found",
      message: ticketOrganizationNotFoundMessage,
    });
    expect(ticketsRepository.listByOrganizationId).not.toHaveBeenCalled();
  });
});

import { describe, expect, it, vi } from "vitest";

import { ticketOrganizationNotFoundMessage } from "../../domain/tickets.constants.js";
import { TicketsService } from "../../service/tickets.service.js";
import {
  createServiceTestTicketsRepository,
  existingOrganizationLookup,
  missingOrganizationLookup,
  serviceTestOrganizationId,
  serviceTestTicket,
} from "./tickets.service.testUtils.js";

describe("TicketsService listTickets", () => {
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

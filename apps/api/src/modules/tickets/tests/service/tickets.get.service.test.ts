import { describe, expect, it, vi } from "vitest";

import { ticketNotFoundMessage } from "../../domain/tickets.constants.js";
import { TicketsService } from "../../service/tickets.service.js";
import {
  createServiceTestTicketsRepository,
  existingOrganizationLookup,
  serviceTestOrganizationId,
  serviceTestTicket,
} from "./tickets.service.testUtils.js";

describe("TicketsService getTicket", () => {
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
});

import { describe, expect, it, vi } from "vitest";

import { TicketsService } from "../../service/tickets.service.js";
import {
  createServiceTestTicketsRepository,
  existingOrganizationLookup,
  serviceTestOrganizationId,
  serviceTestTicket,
} from "./tickets.service.testUtils.js";

describe("TicketsService updateTicketStatus success", () => {
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
});

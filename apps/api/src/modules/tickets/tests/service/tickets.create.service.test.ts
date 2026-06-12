import { describe, expect, it } from "vitest";

import { ticketOrganizationNotFoundMessage } from "../../domain/tickets.constants.js";
import { TicketsService } from "../../service/tickets.service.js";
import {
  createServiceTestTicketsRepository,
  existingOrganizationLookup,
  missingOrganizationLookup,
  serviceTestCreateTicketInput,
  serviceTestOrganizationId,
  serviceTestTicket,
} from "./tickets.service.testUtils.js";

describe("TicketsService createTicket", () => {
  it("creates a ticket for an existing organization", async () => {
    const ticketsRepository = createServiceTestTicketsRepository();
    const service = new TicketsService(existingOrganizationLookup, ticketsRepository);

    const result = await service.createTicket({
      organizationId: serviceTestOrganizationId,
      input: serviceTestCreateTicketInput,
    });

    expect(result).toEqual({
      status: "created",
      ticket: serviceTestTicket,
    });
    expect(ticketsRepository.create).toHaveBeenCalledWith({
      organizationId: serviceTestOrganizationId,
      subject: serviceTestCreateTicketInput.subject,
      description: serviceTestCreateTicketInput.description,
      priority: serviceTestCreateTicketInput.priority,
    });
  });

  it("reports a missing organization before attempting ticket creation", async () => {
    const ticketsRepository = createServiceTestTicketsRepository();
    const service = new TicketsService(missingOrganizationLookup, ticketsRepository);

    const result = await service.createTicket({
      organizationId: serviceTestOrganizationId,
      input: serviceTestCreateTicketInput,
    });

    expect(result).toEqual({
      status: "not-found",
      message: ticketOrganizationNotFoundMessage,
    });
    expect(ticketsRepository.create).not.toHaveBeenCalled();
  });
});

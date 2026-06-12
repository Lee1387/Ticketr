import { describe, expect, it } from "vitest";

import {
  type OrganizationLookup,
  ticketCreationNotImplementedMessage,
  ticketOrganizationNotFoundMessage,
  TicketsService,
} from "./tickets.service.js";

describe("TicketsService", () => {
  const organizationId = "6b4df69e-0950-4209-b79a-a5b5d251540f";
  const input = {
    subject: "Cannot access account",
    description: "The customer cannot sign in after resetting their password.",
    priority: "normal" as const,
  };

  it("reports ticket creation as not implemented for an existing organization", async () => {
    const organizationLookup: OrganizationLookup = {
      findById: (id) => Promise.resolve({ id }),
    };
    const service = new TicketsService(organizationLookup);

    const result = await service.createTicket({
      organizationId,
      input,
    });

    expect(result).toEqual({
      status: "not-implemented",
      message: ticketCreationNotImplementedMessage,
    });
  });

  it("reports a missing organization before attempting ticket creation", async () => {
    const organizationLookup: OrganizationLookup = {
      findById: () => Promise.resolve(null),
    };
    const service = new TicketsService(organizationLookup);

    const result = await service.createTicket({
      organizationId,
      input,
    });

    expect(result).toEqual({
      status: "not-found",
      message: ticketOrganizationNotFoundMessage,
    });
  });
});

import { describe, expect, it } from "vitest";

import { ticketCreationNotImplementedMessage, TicketsService } from "./tickets.service.js";

describe("TicketsService", () => {
  it("reports ticket creation as not implemented until persistence exists", () => {
    const service = new TicketsService();

    const result = service.createTicket({
      organizationId: "6b4df69e-0950-4209-b79a-a5b5d251540f",
      input: {
        subject: "Cannot access account",
        description: "The customer cannot sign in after resetting their password.",
        priority: "normal",
      },
    });

    expect(result).toEqual({
      status: "not-implemented",
      message: ticketCreationNotImplementedMessage,
    });
  });
});

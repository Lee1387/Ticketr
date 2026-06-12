import { describe, expect, it } from "vitest";

import {
  createTicketSchema,
  ticketPriorityValues,
  ticketStatusValues,
} from "../../domain/tickets.schemas.js";

describe("ticket schemas", () => {
  it("defines the supported ticket statuses", () => {
    expect(ticketStatusValues).toEqual(["open", "pending", "resolved", "closed"]);
  });

  it("defines the supported ticket priorities", () => {
    expect(ticketPriorityValues).toEqual(["low", "normal", "high", "urgent"]);
  });

  it("normalizes and defaults create ticket input", () => {
    expect(
      createTicketSchema.parse({
        subject: "  Login issue  ",
        description: "  Customer cannot sign in.  ",
      }),
    ).toEqual({
      subject: "Login issue",
      description: "Customer cannot sign in.",
      priority: "normal",
    });
  });

  it("accepts an explicit ticket priority", () => {
    expect(
      createTicketSchema.parse({
        subject: "Billing issue",
        description: "Invoice total looks wrong.",
        priority: "high",
      }),
    ).toEqual({
      subject: "Billing issue",
      description: "Invoice total looks wrong.",
      priority: "high",
    });
  });

  it("rejects blank ticket content", () => {
    expect(() =>
      createTicketSchema.parse({
        subject: "   ",
        description: "   ",
      }),
    ).toThrow();
  });
});

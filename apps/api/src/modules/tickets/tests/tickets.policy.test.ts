import { describe, expect, it } from "vitest";

import { canTransitionTicketStatus } from "../tickets.policy.js";

describe("ticket status policy", () => {
  it("allows expected ticket lifecycle transitions", () => {
    expect(canTransitionTicketStatus({ from: "open", to: "pending" })).toBe(true);
    expect(canTransitionTicketStatus({ from: "pending", to: "resolved" })).toBe(true);
    expect(canTransitionTicketStatus({ from: "resolved", to: "closed" })).toBe(true);
    expect(canTransitionTicketStatus({ from: "closed", to: "open" })).toBe(true);
  });

  it("allows idempotent status updates", () => {
    expect(canTransitionTicketStatus({ from: "closed", to: "closed" })).toBe(true);
  });

  it("rejects unsupported ticket lifecycle transitions", () => {
    expect(canTransitionTicketStatus({ from: "closed", to: "resolved" })).toBe(false);
    expect(canTransitionTicketStatus({ from: "resolved", to: "pending" })).toBe(false);
  });
});

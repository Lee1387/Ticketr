import type { TicketStatus } from "../domain/tickets.types.js";

const allowedNextStatusesByStatus: Record<TicketStatus, readonly TicketStatus[]> = {
  open: ["pending", "resolved", "closed"],
  pending: ["open", "resolved", "closed"],
  resolved: ["open", "closed"],
  closed: ["open"],
};

export function canTransitionTicketStatus(input: {
  from: TicketStatus;
  to: TicketStatus;
}): boolean {
  if (input.from === input.to) {
    return true;
  }

  return allowedNextStatusesByStatus[input.from].includes(input.to);
}

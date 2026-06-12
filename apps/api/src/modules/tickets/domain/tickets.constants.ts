export const ticketStatusValues = ["open", "pending", "resolved", "closed"] as const;

export const ticketPriorityValues = ["low", "normal", "high", "urgent"] as const;

export const ticketOrganizationNotFoundMessage = "Organization was not found.";

export const ticketNotFoundMessage = "Ticket was not found.";

export const ticketStatusTransitionNotAllowedMessage = "Ticket status transition is not allowed.";

export const ticketStatusChangedBeforeUpdateMessage =
  "Ticket status changed before it could be updated.";

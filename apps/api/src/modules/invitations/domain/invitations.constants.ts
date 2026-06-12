export const invitationStatusValues = ["pending", "accepted", "revoked", "expired"] as const;

export const invitationAlreadyPendingMessage =
  "An invitation is already pending for this email address.";

export const invitationAlreadyAcceptedMessage = "User is already a member of this organization.";

export const invitationEmailMismatchMessage = "Invitation does not belong to this user.";

export const invitationExpiredMessage = "Invitation has expired.";

export const invitationNotFoundMessage = "Invitation was not found.";

export const invitationOrganizationInactiveMessage = "Organization is not active.";

export const invitationOrganizationNotFoundMessage = "Organization was not found.";

export const invitationUserInactiveMessage = "User is not active.";

export const invitationUserNotFoundMessage = "User was not found.";

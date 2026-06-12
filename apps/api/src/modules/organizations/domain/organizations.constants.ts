export const organizationStatusValues = ["active", "suspended"] as const;

export const organizationMemberRoleValues = ["owner", "admin", "agent"] as const;

export const organizationNotFoundMessage = "Organization was not found.";

export const organizationMemberNotFoundMessage = "Organization member was not found.";

export const organizationMemberRoleChangeForbiddenMessage =
  "You do not have permission to manage organization member roles.";

export const organizationOwnerRoleChangeNotAllowedMessage =
  "Owner role changes require an ownership transfer.";

export const organizationMemberRoleChangedBeforeUpdateMessage =
  "Organization member role changed before it could be updated.";

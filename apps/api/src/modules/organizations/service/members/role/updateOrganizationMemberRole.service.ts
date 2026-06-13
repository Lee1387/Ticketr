import {
  organizationMemberNotFoundMessage,
  organizationMemberRoleChangedBeforeUpdateMessage,
  organizationMemberRoleChangeForbiddenMessage,
  organizationNotFoundMessage,
  organizationOwnerRoleChangeNotAllowedMessage,
} from "../../../domain/organizations.constants.js";
import { canManageOrganizationMemberRoles } from "../../../domain/organizations.policy.js";
import type {
  OrganizationMemberRoleLookupPort,
  OrganizationMemberRoleUpdaterPort,
  OrganizationsRepositoryPort,
} from "../../contracts/organizations.service.ports.js";
import type {
  UpdateOrganizationMemberRoleCommand,
  UpdateOrganizationMemberRoleResult,
} from "../../contracts/organizations.service.types.js";

type UpdateOrganizationMemberRoleDependencies = {
  organizationMemberRoleLookup: OrganizationMemberRoleLookupPort;
  organizationMemberRoleUpdater: OrganizationMemberRoleUpdaterPort;
  organizationsRepository: OrganizationsRepositoryPort;
};

export async function updateOrganizationMemberRole(
  command: UpdateOrganizationMemberRoleCommand,
  dependencies: UpdateOrganizationMemberRoleDependencies,
): Promise<UpdateOrganizationMemberRoleResult> {
  if (!canManageOrganizationMemberRoles({ role: command.actorRole })) {
    return {
      status: "forbidden",
      message: organizationMemberRoleChangeForbiddenMessage,
    };
  }

  const organization = await dependencies.organizationsRepository.findById(command.organizationId);

  if (organization === null) {
    return {
      status: "organization-not-found",
      message: organizationNotFoundMessage,
    };
  }

  const member = await dependencies.organizationMemberRoleLookup.findRoleByOrganizationIdAndUserId({
    organizationId: command.organizationId,
    userId: command.userId,
  });

  if (member === null || member.membershipStatus !== "active") {
    return {
      status: "member-not-found",
      message: organizationMemberNotFoundMessage,
    };
  }

  if (member.role === "owner" || command.input.role === "owner") {
    return {
      status: "forbidden",
      message: organizationOwnerRoleChangeNotAllowedMessage,
    };
  }

  const updatedMember =
    await dependencies.organizationMemberRoleUpdater.updateRoleByOrganizationIdAndUserId({
      currentRole: member.role,
      currentStatus: "active",
      organizationId: command.organizationId,
      role: command.input.role,
      userId: command.userId,
    });

  if (updatedMember === null) {
    return {
      status: "conflict",
      message: organizationMemberRoleChangedBeforeUpdateMessage,
    };
  }

  return {
    status: "updated",
    member: updatedMember,
  };
}

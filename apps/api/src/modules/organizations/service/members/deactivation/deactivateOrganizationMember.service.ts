import {
  organizationMemberDeactivationForbiddenMessage,
  organizationMemberNotFoundMessage,
  organizationMemberStatusChangedBeforeUpdateMessage,
  organizationNotFoundMessage,
  organizationOwnerDeactivationNotAllowedMessage,
} from "../../../domain/organizations.constants.js";
import { canDeactivateOrganizationMembers } from "../../../domain/organizations.policy.js";
import type {
  OrganizationMemberRoleLookupPort,
  OrganizationMemberStatusUpdaterPort,
  OrganizationsRepositoryPort,
} from "../../contracts/organizations.service.ports.js";
import type {
  DeactivateOrganizationMemberCommand,
  DeactivateOrganizationMemberResult,
} from "../../contracts/organizations.service.types.js";

type DeactivateOrganizationMemberDependencies = {
  organizationMemberRoleLookup: OrganizationMemberRoleLookupPort;
  organizationMemberStatusUpdater: OrganizationMemberStatusUpdaterPort;
  organizationsRepository: OrganizationsRepositoryPort;
};

export async function deactivateOrganizationMember(
  command: DeactivateOrganizationMemberCommand,
  dependencies: DeactivateOrganizationMemberDependencies,
): Promise<DeactivateOrganizationMemberResult> {
  if (!canDeactivateOrganizationMembers({ role: command.actorRole })) {
    return {
      status: "forbidden",
      message: organizationMemberDeactivationForbiddenMessage,
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

  if (member.role === "owner") {
    return {
      status: "forbidden",
      message: organizationOwnerDeactivationNotAllowedMessage,
    };
  }

  const deactivatedMember =
    await dependencies.organizationMemberStatusUpdater.updateStatusByOrganizationIdAndUserId({
      currentStatus: "active",
      organizationId: command.organizationId,
      status: "deactivated",
      userId: command.userId,
    });

  if (deactivatedMember === null) {
    return {
      status: "conflict",
      message: organizationMemberStatusChangedBeforeUpdateMessage,
    };
  }

  return {
    status: "deactivated",
    member: deactivatedMember,
  };
}

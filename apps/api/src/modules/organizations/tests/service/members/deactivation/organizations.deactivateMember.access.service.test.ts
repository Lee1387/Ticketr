import { describe, expect, it, vi } from "vitest";

import {
  organizationMemberDeactivationForbiddenMessage,
  organizationOwnerDeactivationNotAllowedMessage,
} from "../../../../domain/organizations.constants.js";
import { deactivateOrganizationMember } from "../../../../service/members/deactivation/deactivateOrganizationMember.service.js";
import type { OrganizationMemberRoleLookupPort } from "../../../../service/contracts/organizations.service.ports.js";
import {
  createOrganizationMemberRoleLookup,
  createOrganizationMemberStatusUpdater,
  createOrganizationsRepository,
  deactivateOrganizationMemberServiceTestCommand,
} from "../../helpers/organizations.service.testUtils.js";

describe("deactivateOrganizationMember access rejections", () => {
  it("rejects actors without member deactivation permission", async () => {
    const organizationMemberRoleLookup = createOrganizationMemberRoleLookup();
    const organizationMemberStatusUpdater = createOrganizationMemberStatusUpdater();
    const organizationsRepository = createOrganizationsRepository();

    const result = await deactivateOrganizationMember(
      {
        ...deactivateOrganizationMemberServiceTestCommand,
        actorRole: "agent",
      },
      {
        organizationMemberRoleLookup,
        organizationMemberStatusUpdater,
        organizationsRepository,
      },
    );

    expect(result).toEqual({
      status: "forbidden",
      message: organizationMemberDeactivationForbiddenMessage,
    });
    expect(organizationsRepository.findById).not.toHaveBeenCalled();
    expect(organizationMemberRoleLookup.findRoleByOrganizationIdAndUserId).not.toHaveBeenCalled();
    expect(
      organizationMemberStatusUpdater.updateStatusByOrganizationIdAndUserId,
    ).not.toHaveBeenCalled();
  });

  it("blocks owner deactivation until ownership transfer is designed", async () => {
    const organizationMemberStatusUpdater = createOrganizationMemberStatusUpdater();

    const result = await deactivateOrganizationMember(
      deactivateOrganizationMemberServiceTestCommand,
      {
        organizationMemberRoleLookup: createOrganizationMemberRoleLookup({
          findRoleByOrganizationIdAndUserId: vi.fn<
            OrganizationMemberRoleLookupPort["findRoleByOrganizationIdAndUserId"]
          >(() => Promise.resolve({ membershipStatus: "active", role: "owner" })),
        }),
        organizationMemberStatusUpdater,
        organizationsRepository: createOrganizationsRepository(),
      },
    );

    expect(result).toEqual({
      status: "forbidden",
      message: organizationOwnerDeactivationNotAllowedMessage,
    });
    expect(
      organizationMemberStatusUpdater.updateStatusByOrganizationIdAndUserId,
    ).not.toHaveBeenCalled();
  });
});

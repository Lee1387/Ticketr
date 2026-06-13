import { describe, expect, it, vi } from "vitest";

import {
  organizationMemberNotFoundMessage,
  organizationMemberStatusChangedBeforeUpdateMessage,
  organizationNotFoundMessage,
} from "../../../../domain/organizations.constants.js";
import { deactivateOrganizationMember } from "../../../../service/members/deactivation/deactivateOrganizationMember.service.js";
import {
  createOrganizationMemberRoleLookup,
  createOrganizationMemberStatusUpdater,
  createOrganizationsRepository,
  deactivateOrganizationMemberServiceTestCommand,
} from "../../helpers/organizations.service.testUtils.js";

describe("deactivateOrganizationMember lookup rejections", () => {
  it("reports a missing organization", async () => {
    const organizationMemberRoleLookup = createOrganizationMemberRoleLookup();
    const organizationMemberStatusUpdater = createOrganizationMemberStatusUpdater();

    const result = await deactivateOrganizationMember(
      deactivateOrganizationMemberServiceTestCommand,
      {
        organizationMemberRoleLookup,
        organizationMemberStatusUpdater,
        organizationsRepository: createOrganizationsRepository({
          findById: vi.fn(() => Promise.resolve(null)),
        }),
      },
    );

    expect(result).toEqual({
      status: "organization-not-found",
      message: organizationNotFoundMessage,
    });
    expect(organizationMemberRoleLookup.findRoleByOrganizationIdAndUserId).not.toHaveBeenCalled();
    expect(
      organizationMemberStatusUpdater.updateStatusByOrganizationIdAndUserId,
    ).not.toHaveBeenCalled();
  });

  it("reports a missing organization member", async () => {
    const organizationMemberStatusUpdater = createOrganizationMemberStatusUpdater();

    const result = await deactivateOrganizationMember(
      deactivateOrganizationMemberServiceTestCommand,
      {
        organizationMemberRoleLookup: createOrganizationMemberRoleLookup({
          findRoleByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
        }),
        organizationMemberStatusUpdater,
        organizationsRepository: createOrganizationsRepository(),
      },
    );

    expect(result).toEqual({
      status: "member-not-found",
      message: organizationMemberNotFoundMessage,
    });
    expect(
      organizationMemberStatusUpdater.updateStatusByOrganizationIdAndUserId,
    ).not.toHaveBeenCalled();
  });

  it("reports a deactivated organization member as missing", async () => {
    const organizationMemberStatusUpdater = createOrganizationMemberStatusUpdater();

    const result = await deactivateOrganizationMember(
      deactivateOrganizationMemberServiceTestCommand,
      {
        organizationMemberRoleLookup: createOrganizationMemberRoleLookup({
          findRoleByOrganizationIdAndUserId: vi.fn(() =>
            Promise.resolve({
              membershipStatus: "deactivated" as const,
              role: "agent" as const,
            }),
          ),
        }),
        organizationMemberStatusUpdater,
        organizationsRepository: createOrganizationsRepository(),
      },
    );

    expect(result).toEqual({
      status: "member-not-found",
      message: organizationMemberNotFoundMessage,
    });
    expect(
      organizationMemberStatusUpdater.updateStatusByOrganizationIdAndUserId,
    ).not.toHaveBeenCalled();
  });

  it("reports a concurrent status update conflict", async () => {
    const result = await deactivateOrganizationMember(
      deactivateOrganizationMemberServiceTestCommand,
      {
        organizationMemberRoleLookup: createOrganizationMemberRoleLookup(),
        organizationMemberStatusUpdater: createOrganizationMemberStatusUpdater({
          updateStatusByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
        }),
        organizationsRepository: createOrganizationsRepository(),
      },
    );

    expect(result).toEqual({
      status: "conflict",
      message: organizationMemberStatusChangedBeforeUpdateMessage,
    });
  });
});

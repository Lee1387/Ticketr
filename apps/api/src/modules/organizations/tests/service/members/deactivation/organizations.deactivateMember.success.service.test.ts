import { describe, expect, it } from "vitest";

import { deactivateOrganizationMember } from "../../../../service/members/deactivation/deactivateOrganizationMember.service.js";
import {
  createOrganizationMemberRoleLookup,
  createOrganizationMemberStatusUpdater,
  createOrganizationsRepository,
  deactivateOrganizationMemberServiceTestCommand,
} from "../../helpers/organizations.service.testUtils.js";

describe("deactivateOrganizationMember success", () => {
  it("deactivates an active organization member", async () => {
    const organizationMemberStatusUpdater = createOrganizationMemberStatusUpdater();

    const result = await deactivateOrganizationMember(
      deactivateOrganizationMemberServiceTestCommand,
      {
        organizationMemberRoleLookup: createOrganizationMemberRoleLookup(),
        organizationMemberStatusUpdater,
        organizationsRepository: createOrganizationsRepository(),
      },
    );

    expect(result).toEqual({
      status: "deactivated",
      member: {
        membershipStatus: "deactivated",
        organizationId: deactivateOrganizationMemberServiceTestCommand.organizationId,
        role: "agent",
        userId: deactivateOrganizationMemberServiceTestCommand.userId,
      },
    });
    expect(
      organizationMemberStatusUpdater.updateStatusByOrganizationIdAndUserId,
    ).toHaveBeenCalledWith({
      currentStatus: "active",
      organizationId: deactivateOrganizationMemberServiceTestCommand.organizationId,
      status: "deactivated",
      userId: deactivateOrganizationMemberServiceTestCommand.userId,
    });
  });
});

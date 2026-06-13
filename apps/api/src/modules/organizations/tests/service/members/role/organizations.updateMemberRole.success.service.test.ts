import { describe, expect, it } from "vitest";

import { updateOrganizationMemberRole } from "../../../../service/members/role/updateOrganizationMemberRole.service.js";
import {
  createOrganizationMemberRoleLookup,
  createOrganizationMemberRoleUpdater,
  createOrganizationsRepository,
  updateOrganizationMemberRoleServiceTestCommand,
} from "../../helpers/organizations.service.testUtils.js";

describe("updateOrganizationMemberRole success", () => {
  it("updates an organization member role", async () => {
    const organizationMemberRoleUpdater = createOrganizationMemberRoleUpdater();

    const result = await updateOrganizationMemberRole(
      updateOrganizationMemberRoleServiceTestCommand,
      {
        organizationMemberRoleLookup: createOrganizationMemberRoleLookup(),
        organizationMemberRoleUpdater,
        organizationsRepository: createOrganizationsRepository(),
      },
    );

    expect(result).toEqual({
      status: "updated",
      member: {
        membershipStatus: "active",
        organizationId: updateOrganizationMemberRoleServiceTestCommand.organizationId,
        role: updateOrganizationMemberRoleServiceTestCommand.input.role,
        userId: updateOrganizationMemberRoleServiceTestCommand.userId,
      },
    });
    expect(organizationMemberRoleUpdater.updateRoleByOrganizationIdAndUserId).toHaveBeenCalledWith({
      currentRole: "admin",
      currentStatus: "active",
      organizationId: updateOrganizationMemberRoleServiceTestCommand.organizationId,
      role: updateOrganizationMemberRoleServiceTestCommand.input.role,
      userId: updateOrganizationMemberRoleServiceTestCommand.userId,
    });
  });
});

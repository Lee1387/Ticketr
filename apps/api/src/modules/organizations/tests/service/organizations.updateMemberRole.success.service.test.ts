import { describe, expect, it } from "vitest";

import { updateOrganizationMemberRole } from "../../service/updateOrganizationMemberRole.service.js";
import {
  createOrganizationMemberRoleLookup,
  createOrganizationMemberRoleUpdater,
  createOrganizationsRepository,
  updateOrganizationMemberRoleServiceTestCommand,
} from "./organizations.service.testUtils.js";

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
        organizationId: updateOrganizationMemberRoleServiceTestCommand.organizationId,
        role: updateOrganizationMemberRoleServiceTestCommand.input.role,
        userId: updateOrganizationMemberRoleServiceTestCommand.userId,
      },
    });
    expect(organizationMemberRoleUpdater.updateRoleByOrganizationIdAndUserId).toHaveBeenCalledWith({
      currentRole: "admin",
      organizationId: updateOrganizationMemberRoleServiceTestCommand.organizationId,
      role: updateOrganizationMemberRoleServiceTestCommand.input.role,
      userId: updateOrganizationMemberRoleServiceTestCommand.userId,
    });
  });
});

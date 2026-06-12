import { describe, expect, it, vi } from "vitest";

import {
  organizationMemberNotFoundMessage,
  organizationMemberRoleChangedBeforeUpdateMessage,
  organizationNotFoundMessage,
} from "../../domain/organizations.constants.js";
import { updateOrganizationMemberRole } from "../../service/updateOrganizationMemberRole.service.js";
import {
  createOrganizationMemberRoleLookup,
  createOrganizationMemberRoleUpdater,
  createOrganizationsRepository,
  updateOrganizationMemberRoleServiceTestCommand,
} from "./organizations.service.testUtils.js";

describe("updateOrganizationMemberRole lookup rejections", () => {
  it("reports a missing organization", async () => {
    const organizationMemberRoleLookup = createOrganizationMemberRoleLookup();
    const organizationMemberRoleUpdater = createOrganizationMemberRoleUpdater();

    const result = await updateOrganizationMemberRole(
      updateOrganizationMemberRoleServiceTestCommand,
      {
        organizationMemberRoleLookup,
        organizationMemberRoleUpdater,
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
      organizationMemberRoleUpdater.updateRoleByOrganizationIdAndUserId,
    ).not.toHaveBeenCalled();
  });

  it("reports a missing organization member", async () => {
    const organizationMemberRoleUpdater = createOrganizationMemberRoleUpdater();

    const result = await updateOrganizationMemberRole(
      updateOrganizationMemberRoleServiceTestCommand,
      {
        organizationMemberRoleLookup: createOrganizationMemberRoleLookup({
          findRoleByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
        }),
        organizationMemberRoleUpdater,
        organizationsRepository: createOrganizationsRepository(),
      },
    );

    expect(result).toEqual({
      status: "member-not-found",
      message: organizationMemberNotFoundMessage,
    });
    expect(
      organizationMemberRoleUpdater.updateRoleByOrganizationIdAndUserId,
    ).not.toHaveBeenCalled();
  });

  it("reports a concurrent role update conflict", async () => {
    const result = await updateOrganizationMemberRole(
      updateOrganizationMemberRoleServiceTestCommand,
      {
        organizationMemberRoleLookup: createOrganizationMemberRoleLookup(),
        organizationMemberRoleUpdater: createOrganizationMemberRoleUpdater({
          updateRoleByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
        }),
        organizationsRepository: createOrganizationsRepository(),
      },
    );

    expect(result).toEqual({
      status: "conflict",
      message: organizationMemberRoleChangedBeforeUpdateMessage,
    });
  });
});

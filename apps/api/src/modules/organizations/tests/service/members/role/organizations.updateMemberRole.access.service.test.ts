import { describe, expect, it, vi } from "vitest";

import {
  organizationMemberRoleChangeForbiddenMessage,
  organizationOwnerRoleChangeNotAllowedMessage,
} from "../../../../domain/organizations.constants.js";
import { updateOrganizationMemberRole } from "../../../../service/members/role/updateOrganizationMemberRole.service.js";
import type { OrganizationMemberRoleLookupPort } from "../../../../service/contracts/organizations.service.ports.js";
import {
  createOrganizationMemberRoleLookup,
  createOrganizationMemberRoleUpdater,
  createOrganizationsRepository,
  updateOrganizationMemberRoleServiceTestCommand,
} from "../../helpers/organizations.service.testUtils.js";

describe("updateOrganizationMemberRole access rejections", () => {
  it("rejects actors without role management permission", async () => {
    const organizationMemberRoleLookup = createOrganizationMemberRoleLookup();
    const organizationMemberRoleUpdater = createOrganizationMemberRoleUpdater();
    const organizationsRepository = createOrganizationsRepository();

    const result = await updateOrganizationMemberRole(
      {
        ...updateOrganizationMemberRoleServiceTestCommand,
        actorRole: "agent",
      },
      {
        organizationMemberRoleLookup,
        organizationMemberRoleUpdater,
        organizationsRepository,
      },
    );

    expect(result).toEqual({
      status: "forbidden",
      message: organizationMemberRoleChangeForbiddenMessage,
    });
    expect(organizationsRepository.findById).not.toHaveBeenCalled();
    expect(organizationMemberRoleLookup.findRoleByOrganizationIdAndUserId).not.toHaveBeenCalled();
    expect(
      organizationMemberRoleUpdater.updateRoleByOrganizationIdAndUserId,
    ).not.toHaveBeenCalled();
  });

  it("blocks owner role changes until ownership transfer is designed", async () => {
    const organizationMemberRoleUpdater = createOrganizationMemberRoleUpdater();

    const result = await updateOrganizationMemberRole(
      updateOrganizationMemberRoleServiceTestCommand,
      {
        organizationMemberRoleLookup: createOrganizationMemberRoleLookup({
          findRoleByOrganizationIdAndUserId: vi.fn<
            OrganizationMemberRoleLookupPort["findRoleByOrganizationIdAndUserId"]
          >(() => Promise.resolve({ membershipStatus: "active", role: "owner" })),
        }),
        organizationMemberRoleUpdater,
        organizationsRepository: createOrganizationsRepository(),
      },
    );

    expect(result).toEqual({
      status: "forbidden",
      message: organizationOwnerRoleChangeNotAllowedMessage,
    });
    expect(
      organizationMemberRoleUpdater.updateRoleByOrganizationIdAndUserId,
    ).not.toHaveBeenCalled();
  });

  it("blocks assigning the owner role until ownership transfer is designed", async () => {
    const organizationMemberRoleUpdater = createOrganizationMemberRoleUpdater();

    const result = await updateOrganizationMemberRole(
      {
        ...updateOrganizationMemberRoleServiceTestCommand,
        input: {
          role: "owner",
        },
      },
      {
        organizationMemberRoleLookup: createOrganizationMemberRoleLookup(),
        organizationMemberRoleUpdater,
        organizationsRepository: createOrganizationsRepository(),
      },
    );

    expect(result).toEqual({
      status: "forbidden",
      message: organizationOwnerRoleChangeNotAllowedMessage,
    });
    expect(
      organizationMemberRoleUpdater.updateRoleByOrganizationIdAndUserId,
    ).not.toHaveBeenCalled();
  });
});

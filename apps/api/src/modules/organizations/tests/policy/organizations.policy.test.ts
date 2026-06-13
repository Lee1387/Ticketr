import { describe, expect, it } from "vitest";

import {
  canCreateOrganizationTicket,
  canDeactivateOrganizationMembers,
  canManageOrganizationMemberRoles,
  canManageOrganizationInvitations,
  canReadOrganization,
  canReadOrganizationTickets,
  canUpdateOrganizationTicketStatus,
} from "../../domain/organizations.policy.js";
import { organizationMemberRoleValues } from "../../domain/organizations.schemas.js";

describe("organization policy", () => {
  it("allows organization members to read organization details", () => {
    for (const role of organizationMemberRoleValues) {
      expect(
        canReadOrganization({
          role,
        }),
      ).toBe(true);
    }
  });

  it("allows organization members to read organization tickets", () => {
    for (const role of organizationMemberRoleValues) {
      expect(
        canReadOrganizationTickets({
          role,
        }),
      ).toBe(true);
    }
  });

  it("allows organization members to create organization tickets", () => {
    for (const role of organizationMemberRoleValues) {
      expect(
        canCreateOrganizationTicket({
          role,
        }),
      ).toBe(true);
    }
  });

  it("allows organization members to update organization ticket status", () => {
    for (const role of organizationMemberRoleValues) {
      expect(
        canUpdateOrganizationTicketStatus({
          role,
        }),
      ).toBe(true);
    }
  });

  it("allows owners and admins to manage organization invitations", () => {
    expect(canManageOrganizationInvitations({ role: "owner" })).toBe(true);
    expect(canManageOrganizationInvitations({ role: "admin" })).toBe(true);
    expect(canManageOrganizationInvitations({ role: "agent" })).toBe(false);
  });

  it("allows owners and admins to manage organization member roles", () => {
    expect(canManageOrganizationMemberRoles({ role: "owner" })).toBe(true);
    expect(canManageOrganizationMemberRoles({ role: "admin" })).toBe(true);
    expect(canManageOrganizationMemberRoles({ role: "agent" })).toBe(false);
  });

  it("allows owners and admins to deactivate organization members", () => {
    expect(canDeactivateOrganizationMembers({ role: "owner" })).toBe(true);
    expect(canDeactivateOrganizationMembers({ role: "admin" })).toBe(true);
    expect(canDeactivateOrganizationMembers({ role: "agent" })).toBe(false);
  });
});

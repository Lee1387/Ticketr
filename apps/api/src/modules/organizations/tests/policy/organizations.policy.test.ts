import { describe, expect, it } from "vitest";

import {
  canCreateOrganizationTicket,
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
});

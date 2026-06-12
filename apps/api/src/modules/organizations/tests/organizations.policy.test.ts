import { describe, expect, it } from "vitest";

import {
  canCreateOrganizationTicket,
  canReadOrganization,
  canReadOrganizationTickets,
  canUpdateOrganizationTicketStatus,
} from "../organizations.policy.js";
import { organizationMemberRoleValues } from "../organizations.schemas.js";

describe("organization policy", () => {
  const organizationId = "6b4df69e-0950-4209-b79a-a5b5d251540f";

  it("allows organization members to read organization details", () => {
    for (const role of organizationMemberRoleValues) {
      expect(
        canReadOrganization({
          organizationId,
          requestedOrganizationId: organizationId,
          role,
        }),
      ).toBe(true);
    }
  });

  it("prevents organization members from reading another organization", () => {
    expect(
      canReadOrganization({
        organizationId,
        requestedOrganizationId: "de4d1aba-8c93-4a2a-9844-856e5976da48",
        role: "owner",
      }),
    ).toBe(false);
  });

  it("allows organization members to read organization tickets", () => {
    for (const role of organizationMemberRoleValues) {
      expect(
        canReadOrganizationTickets({
          organizationId,
          requestedOrganizationId: organizationId,
          role,
        }),
      ).toBe(true);
    }
  });

  it("allows organization members to create organization tickets", () => {
    for (const role of organizationMemberRoleValues) {
      expect(
        canCreateOrganizationTicket({
          organizationId,
          requestedOrganizationId: organizationId,
          role,
        }),
      ).toBe(true);
    }
  });

  it("allows organization members to update organization ticket status", () => {
    for (const role of organizationMemberRoleValues) {
      expect(
        canUpdateOrganizationTicketStatus({
          organizationId,
          requestedOrganizationId: organizationId,
          role,
        }),
      ).toBe(true);
    }
  });

  it("prevents organization members from reading another organization's tickets", () => {
    expect(
      canReadOrganizationTickets({
        organizationId,
        requestedOrganizationId: "de4d1aba-8c93-4a2a-9844-856e5976da48",
        role: "owner",
      }),
    ).toBe(false);
  });

  it("prevents organization members from creating another organization's tickets", () => {
    expect(
      canCreateOrganizationTicket({
        organizationId,
        requestedOrganizationId: "de4d1aba-8c93-4a2a-9844-856e5976da48",
        role: "owner",
      }),
    ).toBe(false);
  });

  it("prevents organization members from updating another organization's ticket status", () => {
    expect(
      canUpdateOrganizationTicketStatus({
        organizationId,
        requestedOrganizationId: "de4d1aba-8c93-4a2a-9844-856e5976da48",
        role: "owner",
      }),
    ).toBe(false);
  });
});

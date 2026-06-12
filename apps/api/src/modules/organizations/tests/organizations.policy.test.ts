import { describe, expect, it } from "vitest";

import { canReadOrganization, canReadOrganizationTickets } from "../organizations.policy.js";
import { organizationMemberRoleValues } from "../organizations.schemas.js";

describe("organization policy", () => {
  it("allows organization members to read organization details", () => {
    for (const role of organizationMemberRoleValues) {
      expect(canReadOrganization({ role })).toBe(true);
    }
  });

  it("allows organization members to read organization tickets", () => {
    for (const role of organizationMemberRoleValues) {
      expect(canReadOrganizationTickets({ role })).toBe(true);
    }
  });
});

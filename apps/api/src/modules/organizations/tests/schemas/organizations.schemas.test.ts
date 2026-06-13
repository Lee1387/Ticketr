import { describe, expect, it } from "vitest";

import {
  organizationIdSchema,
  organizationMemberRoleSchema,
  organizationMemberRoleValues,
  organizationMemberStatusSchema,
  organizationMemberStatusValues,
  organizationStatusSchema,
  organizationStatusValues,
  updateOrganizationMemberRoleSchema,
} from "../../domain/organizations.schemas.js";

describe("organization schemas", () => {
  it("accepts UUID organization identifiers", () => {
    expect(organizationIdSchema.safeParse("6b4df69e-0950-4209-b79a-a5b5d251540f").success).toBe(
      true,
    );
  });

  it("rejects invalid organization identifiers", () => {
    expect(organizationIdSchema.safeParse("not-an-organization-id").success).toBe(false);
  });

  it("accepts supported organization statuses", () => {
    expect(organizationStatusValues).toEqual(["active", "suspended"]);

    for (const status of organizationStatusValues) {
      expect(organizationStatusSchema.safeParse(status).success).toBe(true);
    }
  });

  it("rejects unsupported organization statuses", () => {
    expect(organizationStatusSchema.safeParse("deleted").success).toBe(false);
  });

  it("accepts supported organization member roles", () => {
    expect(organizationMemberRoleValues).toEqual(["owner", "admin", "agent"]);

    for (const role of organizationMemberRoleValues) {
      expect(organizationMemberRoleSchema.safeParse(role).success).toBe(true);
    }
  });

  it("rejects customer as an organization member role", () => {
    expect(organizationMemberRoleSchema.safeParse("customer").success).toBe(false);
  });

  it("accepts supported organization member statuses", () => {
    expect(organizationMemberStatusValues).toEqual(["active", "deactivated"]);

    for (const status of organizationMemberStatusValues) {
      expect(organizationMemberStatusSchema.safeParse(status).success).toBe(true);
    }
  });

  it("rejects unsupported organization member statuses", () => {
    expect(organizationMemberStatusSchema.safeParse("deleted").success).toBe(false);
  });

  it("parses update organization member role input", () => {
    expect(
      updateOrganizationMemberRoleSchema.parse({
        role: "admin",
      }),
    ).toEqual({
      role: "admin",
    });
  });
});

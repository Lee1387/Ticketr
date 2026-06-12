import { describe, expect, it } from "vitest";

import {
  createInvitationSchema,
  invitationEmailSchema,
  invitationRoleSchema,
  invitationStatusSchema,
  listInvitationsQuerySchema,
} from "../../domain/invitations.schemas.js";

describe("invitation schemas", () => {
  it("normalizes invitation email addresses", () => {
    expect(invitationEmailSchema.parse("  AGENT@TICKETR.LOCAL  ")).toBe("agent@ticketr.local");
  });

  it("accepts organization member roles for invitations", () => {
    expect(invitationRoleSchema.parse("agent")).toBe("agent");
  });

  it("parses create invitation input", () => {
    expect(
      createInvitationSchema.parse({
        email: "  AGENT@TICKETR.LOCAL  ",
        expiresAt: "2026-01-08T00:00:00.000Z",
        role: "agent",
      }),
    ).toEqual({
      email: "agent@ticketr.local",
      expiresAt: new Date("2026-01-08T00:00:00.000Z"),
      role: "agent",
    });
  });

  it("parses list invitation query input", () => {
    expect(
      listInvitationsQuerySchema.parse({
        createdBefore: "2026-01-02T00:00:00.000Z",
        limit: "10",
      }),
    ).toEqual({
      createdBefore: new Date("2026-01-02T00:00:00.000Z"),
      limit: 10,
    });
  });

  it("rejects unsupported invitation statuses", () => {
    expect(() => invitationStatusSchema.parse("unknown")).toThrow();
  });
});

import { describe, expect, it, vi } from "vitest";

import { defaultTestAuthPayload } from "../../../../../test/authTestUtils.js";
import { OrganizationAccessService } from "../../../service/access/organizationAccess.service.js";

describe("OrganizationAccessService", () => {
  const organizationId = defaultTestAuthPayload.organizationId;
  const userId = defaultTestAuthPayload.userId;

  it("verifies a matching organization membership", async () => {
    const findByOrganizationIdAndUserId = vi.fn(() =>
      Promise.resolve({ membershipStatus: "active" as const, role: "agent" as const }),
    );
    const service = new OrganizationAccessService({ findByOrganizationIdAndUserId });

    await expect(
      service.verifyOrganizationMembership({
        auth: defaultTestAuthPayload,
        organizationId,
      }),
    ).resolves.toEqual({
      status: "verified",
      role: "agent",
    });

    expect(findByOrganizationIdAndUserId).toHaveBeenCalledWith({
      organizationId,
      userId,
    });
  });

  it("rejects access when the token organization does not match the requested organization", async () => {
    const findByOrganizationIdAndUserId = vi.fn(() =>
      Promise.resolve({ membershipStatus: "active" as const, role: "agent" as const }),
    );
    const service = new OrganizationAccessService({ findByOrganizationIdAndUserId });

    await expect(
      service.verifyOrganizationMembership({
        auth: defaultTestAuthPayload,
        organizationId: "de4d1aba-8c93-4a2a-9844-856e5976da48",
      }),
    ).resolves.toEqual({ status: "not-member" });

    expect(findByOrganizationIdAndUserId).not.toHaveBeenCalled();
  });

  it("rejects access when membership is missing", async () => {
    const service = new OrganizationAccessService({
      findByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
    });

    await expect(
      service.verifyOrganizationMembership({
        auth: defaultTestAuthPayload,
        organizationId,
      }),
    ).resolves.toEqual({ status: "not-member" });
  });

  it("rejects access when membership is deactivated", async () => {
    const service = new OrganizationAccessService({
      findByOrganizationIdAndUserId: vi.fn(() =>
        Promise.resolve({ membershipStatus: "deactivated" as const, role: "admin" as const }),
      ),
    });

    await expect(
      service.verifyOrganizationMembership({
        auth: defaultTestAuthPayload,
        organizationId,
      }),
    ).resolves.toEqual({ status: "not-member" });
  });

  it("returns the persisted membership role", async () => {
    const service = new OrganizationAccessService({
      findByOrganizationIdAndUserId: vi.fn(() =>
        Promise.resolve({ membershipStatus: "active" as const, role: "admin" as const }),
      ),
    });

    await expect(
      service.verifyOrganizationMembership({
        auth: defaultTestAuthPayload,
        organizationId,
      }),
    ).resolves.toEqual({
      status: "verified",
      role: "admin",
    });
  });
});

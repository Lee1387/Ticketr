import { describe, expect, it, vi } from "vitest";

import { createTestApp } from "../../../test/createTestApp.js";
import { OrganizationsService } from "../organizations.service.js";

describe("organization routes", () => {
  const organization = {
    id: "6b4df69e-0950-4209-b79a-a5b5d251540f",
    name: "Acme Support",
    status: "active" as const,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };

  const organizationResponse = {
    id: organization.id,
    name: organization.name,
    status: organization.status,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };

  it("returns an organization", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${organization.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        organization: organizationResponse,
      });
    } finally {
      await app.close();
    }
  });

  it("returns not found when an organization does not exist", async () => {
    const app = createTestApp({
      services: {
        organizationsService: new OrganizationsService({
          findById: vi.fn(() => Promise.resolve(null)),
        }),
      },
    });

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${organization.id}`,
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({
        error: {
          code: "NOT_FOUND",
          message: "Organization was not found.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("rejects invalid organization identifiers", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: "/organizations/not-an-organization-id",
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        error: {
          code: "BAD_REQUEST",
          message: "Request validation failed.",
        },
      });
    } finally {
      await app.close();
    }
  });
});

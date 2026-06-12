export const organizationRouteTestOrganization = {
  id: "6b4df69e-0950-4209-b79a-a5b5d251540f",
  name: "Acme Support",
  status: "active" as const,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

export const organizationRouteTestResponse = {
  id: organizationRouteTestOrganization.id,
  name: organizationRouteTestOrganization.name,
  status: organizationRouteTestOrganization.status,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

export const organizationMemberRouteTestResponse = {
  createdAt: "2026-01-01T00:00:00.000Z",
  email: "agent@example.com",
  name: "Support Agent",
  role: "agent",
  status: "active",
  userId: "11111111-1111-4111-8111-111111111111",
};

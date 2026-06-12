import type { DatabaseClient } from "../../src/infrastructure/db/client.js";
import { organizationMembersTable } from "../../src/infrastructure/db/schema/organizationMembers.js";
import { organizationsTable } from "../../src/infrastructure/db/schema/organizations.js";
import { usersTable } from "../../src/infrastructure/db/schema/users.js";

export const devSeedData = {
  organization: {
    id: "6b4df69e-0950-4209-b79a-a5b5d251540f",
    name: "Acme Support",
    status: "active" as const,
  },
  user: {
    id: "11111111-1111-4111-8111-111111111111",
    email: "agent@ticketr.local",
    name: "Local Support Agent",
    status: "active" as const,
  },
  membership: {
    role: "agent" as const,
  },
};

export async function seedDevDatabase(db: DatabaseClient): Promise<void> {
  const updatedAt = new Date();

  await db
    .insert(usersTable)
    .values({
      ...devSeedData.user,
      updatedAt,
    })
    .onConflictDoUpdate({
      target: usersTable.id,
      set: {
        email: devSeedData.user.email,
        name: devSeedData.user.name,
        status: devSeedData.user.status,
        updatedAt,
      },
    });

  await db
    .insert(organizationsTable)
    .values({
      ...devSeedData.organization,
      updatedAt,
    })
    .onConflictDoUpdate({
      target: organizationsTable.id,
      set: {
        name: devSeedData.organization.name,
        status: devSeedData.organization.status,
        updatedAt,
      },
    });

  await db
    .insert(organizationMembersTable)
    .values({
      organizationId: devSeedData.organization.id,
      role: devSeedData.membership.role,
      updatedAt,
      userId: devSeedData.user.id,
    })
    .onConflictDoUpdate({
      target: [organizationMembersTable.organizationId, organizationMembersTable.userId],
      set: {
        role: devSeedData.membership.role,
        updatedAt,
      },
    });
}

import type { DatabaseClient } from "../../../src/infrastructure/db/client.js";
import { organizationMembersTable } from "../../../src/infrastructure/db/schema/organizationMembers.js";
import { organizationsTable } from "../../../src/infrastructure/db/schema/organizations.js";
import { usersTable } from "../../../src/infrastructure/db/schema/users.js";

export const devSeedData = {
  organization: {
    id: "6b4df69e-0950-4209-b79a-a5b5d251540f",
    name: "Acme Support",
    status: "active" as const,
  },
  user: {
    id: "11111111-1111-4111-8111-111111111111",
    email: "admin@ticketr.local",
    name: "Local Support Admin",
    passwordHash:
      "$argon2id$v=19$m=19456,t=2,p=1$Wk8d0gFTibmTODqKthmyrA$6ljON+2OHVrQoTsBGeT+izutYbua0N7d2PGcVob4SX8",
    status: "active" as const,
  },
  smokeMemberUser: {
    id: "22222222-2222-4222-8222-222222222222",
    email: "smoke-member@ticketr.local",
    name: "Smoke Test Member",
    passwordHash:
      "$argon2id$v=19$m=19456,t=2,p=1$Wk8d0gFTibmTODqKthmyrA$6ljON+2OHVrQoTsBGeT+izutYbua0N7d2PGcVob4SX8",
    status: "active" as const,
  },
  membership: {
    role: "admin" as const,
  },
  smokeMembership: {
    role: "agent" as const,
    status: "active" as const,
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
        passwordHash: devSeedData.user.passwordHash,
        status: devSeedData.user.status,
        updatedAt,
      },
    });

  await db
    .insert(usersTable)
    .values({
      ...devSeedData.smokeMemberUser,
      updatedAt,
    })
    .onConflictDoUpdate({
      target: usersTable.id,
      set: {
        email: devSeedData.smokeMemberUser.email,
        name: devSeedData.smokeMemberUser.name,
        passwordHash: devSeedData.smokeMemberUser.passwordHash,
        status: devSeedData.smokeMemberUser.status,
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
      status: "active",
      updatedAt,
      userId: devSeedData.user.id,
    })
    .onConflictDoUpdate({
      target: [organizationMembersTable.organizationId, organizationMembersTable.userId],
      set: {
        role: devSeedData.membership.role,
        status: "active",
        updatedAt,
      },
    });

  await db
    .insert(organizationMembersTable)
    .values({
      organizationId: devSeedData.organization.id,
      role: devSeedData.smokeMembership.role,
      status: devSeedData.smokeMembership.status,
      updatedAt,
      userId: devSeedData.smokeMemberUser.id,
    })
    .onConflictDoUpdate({
      target: [organizationMembersTable.organizationId, organizationMembersTable.userId],
      set: {
        role: devSeedData.smokeMembership.role,
        status: "active",
        updatedAt,
      },
    });
}

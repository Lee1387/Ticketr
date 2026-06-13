import { and, eq } from "drizzle-orm";

import type { DatabaseClient } from "../../../infrastructure/db/client.js";
import { organizationMembersTable } from "../../../infrastructure/db/schema/organizationMembers.js";
import type { UserId } from "../../users/domain/users.types.js";
import type {
  OrganizationId,
  OrganizationMemberRole,
  OrganizationMemberStatus,
} from "../domain/organizations.types.js";

export type OrganizationMemberRoleRecord = {
  membershipStatus: OrganizationMemberStatus;
  organizationId: OrganizationId;
  role: OrganizationMemberRole;
  userId: UserId;
};

export class OrganizationMemberRolesRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findRoleByOrganizationIdAndUserId(input: {
    organizationId: OrganizationId;
    userId: UserId;
  }): Promise<{
    membershipStatus: OrganizationMemberStatus;
    role: OrganizationMemberRole;
  } | null> {
    const rows = await this.db
      .select({
        membershipStatus: organizationMembersTable.status,
        role: organizationMembersTable.role,
      })
      .from(organizationMembersTable)
      .where(
        and(
          eq(organizationMembersTable.organizationId, input.organizationId),
          eq(organizationMembersTable.userId, input.userId),
        ),
      )
      .limit(1);

    return rows[0] ?? null;
  }

  async updateRoleByOrganizationIdAndUserId(input: {
    currentRole: OrganizationMemberRole;
    currentStatus: OrganizationMemberStatus;
    organizationId: OrganizationId;
    role: OrganizationMemberRole;
    userId: UserId;
  }): Promise<OrganizationMemberRoleRecord | null> {
    const rows = await this.db
      .update(organizationMembersTable)
      .set({
        role: input.role,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(organizationMembersTable.organizationId, input.organizationId),
          eq(organizationMembersTable.userId, input.userId),
          eq(organizationMembersTable.role, input.currentRole),
          eq(organizationMembersTable.status, input.currentStatus),
        ),
      )
      .returning({
        membershipStatus: organizationMembersTable.status,
        organizationId: organizationMembersTable.organizationId,
        role: organizationMembersTable.role,
        userId: organizationMembersTable.userId,
      });

    return rows[0] ?? null;
  }
}

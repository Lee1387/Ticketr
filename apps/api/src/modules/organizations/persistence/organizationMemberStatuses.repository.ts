import { and, eq } from "drizzle-orm";

import type { DatabaseClient } from "../../../infrastructure/db/client.js";
import { organizationMembersTable } from "../../../infrastructure/db/schema/organizationMembers.js";
import type { UserId } from "../../users/domain/users.types.js";
import type { OrganizationId, OrganizationMemberStatus } from "../domain/organizations.types.js";
import type { OrganizationMemberStatusAssignment } from "../service/contracts/organizations.service.models.js";

export class OrganizationMemberStatusesRepository {
  constructor(private readonly db: DatabaseClient) {}

  async updateStatusByOrganizationIdAndUserId(input: {
    currentStatus: OrganizationMemberStatus;
    organizationId: OrganizationId;
    status: OrganizationMemberStatus;
    userId: UserId;
  }): Promise<OrganizationMemberStatusAssignment | null> {
    const rows = await this.db
      .update(organizationMembersTable)
      .set({
        status: input.status,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(organizationMembersTable.organizationId, input.organizationId),
          eq(organizationMembersTable.userId, input.userId),
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

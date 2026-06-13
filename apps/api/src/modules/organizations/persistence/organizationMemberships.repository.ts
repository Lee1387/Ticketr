import { and, eq } from "drizzle-orm";

import type { DatabaseClient } from "../../../infrastructure/db/client.js";
import {
  organizationMembersTable,
  type OrganizationMemberRow,
} from "../../../infrastructure/db/schema/organizationMembers.js";
import type { UserId } from "../../users/domain/users.types.js";
import type { OrganizationId, OrganizationMemberStatus } from "../domain/organizations.types.js";

export type OrganizationMembershipLookupRecord = Omit<OrganizationMemberRow, "status"> & {
  membershipStatus: OrganizationMemberStatus;
};

export class OrganizationMembershipsRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findByOrganizationIdAndUserId(input: {
    organizationId: OrganizationId;
    userId: UserId;
  }): Promise<OrganizationMembershipLookupRecord | null> {
    const rows = await this.db
      .select()
      .from(organizationMembersTable)
      .where(
        and(
          eq(organizationMembersTable.organizationId, input.organizationId),
          eq(organizationMembersTable.userId, input.userId),
        ),
      )
      .limit(1);

    const member = rows[0];

    if (member === undefined) {
      return null;
    }

    const { status, ...memberWithoutStatus } = member;

    return {
      ...memberWithoutStatus,
      membershipStatus: status,
    };
  }
}

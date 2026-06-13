import { and, desc, eq, lt } from "drizzle-orm";

import type { DatabaseClient } from "../../../infrastructure/db/client.js";
import { organizationMembersTable } from "../../../infrastructure/db/schema/organizationMembers.js";
import { usersTable } from "../../../infrastructure/db/schema/users.js";
import type { UserEmail, UserId, UserStatus } from "../../users/domain/users.types.js";
import type {
  OrganizationId,
  OrganizationMemberRole,
  OrganizationMemberStatus,
} from "../domain/organizations.types.js";

export type OrganizationMemberListRecord = {
  createdAt: Date;
  email: UserEmail;
  membershipStatus: OrganizationMemberStatus;
  name: string;
  role: OrganizationMemberRole;
  status: UserStatus;
  userId: UserId;
};

export class OrganizationMembersReaderRepository {
  constructor(private readonly db: DatabaseClient) {}

  async listByOrganizationId(input: {
    createdBefore?: Date;
    limit: number;
    organizationId: OrganizationId;
  }): Promise<OrganizationMemberListRecord[]> {
    return this.db
      .select({
        createdAt: organizationMembersTable.createdAt,
        email: usersTable.email,
        membershipStatus: organizationMembersTable.status,
        name: usersTable.name,
        role: organizationMembersTable.role,
        status: usersTable.status,
        userId: usersTable.id,
      })
      .from(organizationMembersTable)
      .innerJoin(usersTable, eq(organizationMembersTable.userId, usersTable.id))
      .where(
        input.createdBefore === undefined
          ? eq(organizationMembersTable.organizationId, input.organizationId)
          : and(
              eq(organizationMembersTable.organizationId, input.organizationId),
              lt(organizationMembersTable.createdAt, input.createdBefore),
            ),
      )
      .orderBy(desc(organizationMembersTable.createdAt))
      .limit(input.limit);
  }
}

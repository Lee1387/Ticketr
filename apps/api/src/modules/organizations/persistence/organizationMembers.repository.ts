import { and, desc, eq, lt } from "drizzle-orm";

import type { DatabaseClient } from "../../../infrastructure/db/client.js";
import {
  organizationMembersTable,
  type OrganizationMemberRow,
} from "../../../infrastructure/db/schema/organizationMembers.js";
import { usersTable } from "../../../infrastructure/db/schema/users.js";
import type { UserEmail, UserId, UserStatus } from "../../users/domain/users.types.js";
import type { OrganizationId, OrganizationMemberRole } from "../domain/organizations.types.js";

export type OrganizationMemberListRecord = {
  createdAt: Date;
  email: UserEmail;
  name: string;
  role: OrganizationMemberRole;
  status: UserStatus;
  userId: UserId;
};

export class OrganizationMembersRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findByOrganizationIdAndUserId(input: {
    organizationId: OrganizationId;
    userId: UserId;
  }): Promise<OrganizationMemberRow | null> {
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

    return rows[0] ?? null;
  }

  async listByOrganizationId(input: {
    createdBefore?: Date;
    limit: number;
    organizationId: OrganizationId;
  }): Promise<OrganizationMemberListRecord[]> {
    return this.db
      .select({
        createdAt: organizationMembersTable.createdAt,
        email: usersTable.email,
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

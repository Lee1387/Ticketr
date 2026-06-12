import { and, eq } from "drizzle-orm";

import type { DatabaseClient } from "../../../infrastructure/db/client.js";
import {
  organizationMembersTable,
  type OrganizationMemberRow,
} from "../../../infrastructure/db/schema/organizationMembers.js";
import type { UserId } from "../../users/domain/users.types.js";
import type { OrganizationId } from "../domain/organizations.types.js";

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
}

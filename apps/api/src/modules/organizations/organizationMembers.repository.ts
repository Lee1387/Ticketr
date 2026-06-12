import { and, eq } from "drizzle-orm";

import type { DatabaseClient } from "../../infrastructure/db/client.js";
import {
  organizationMembersTable,
  type OrganizationMemberRow,
} from "../../infrastructure/db/schema/organizationMembers.js";
import type { OrganizationId } from "./organizations.types.js";

export class OrganizationMembersRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findByOrganizationIdAndUserId(input: {
    organizationId: OrganizationId;
    userId: string;
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

import { eq } from "drizzle-orm";

import type { DatabaseClient } from "../../../infrastructure/db/client.js";
import {
  organizationsTable,
  type OrganizationRow,
} from "../../../infrastructure/db/schema/organizations.js";
import type { OrganizationId } from "../domain/organizations.types.js";

export class OrganizationsRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findById(id: OrganizationId): Promise<OrganizationRow | null> {
    const rows = await this.db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.id, id))
      .limit(1);

    return rows[0] ?? null;
  }
}

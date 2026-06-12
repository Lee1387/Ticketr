import { eq } from "drizzle-orm";

import type { DatabaseClient } from "../../../infrastructure/db/client.js";
import { usersTable, type UserRow } from "../../../infrastructure/db/schema/users.js";
import type { UserEmail, UserId } from "../domain/users.types.js";

export class UsersRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findById(id: UserId): Promise<UserRow | null> {
    const rows = await this.db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);

    return rows[0] ?? null;
  }

  async findByEmail(email: UserEmail): Promise<UserRow | null> {
    const rows = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return rows[0] ?? null;
  }
}

import { and, eq } from "drizzle-orm";

import type { DatabaseClient } from "../../../infrastructure/db/client.js";
import {
  invitationsTable,
  type InvitationRow,
  type NewInvitationRow,
} from "../../../infrastructure/db/schema/invitations.js";
import type { OrganizationId } from "../../organizations/domain/organizations.types.js";
import type { InvitationEmail, InvitationId } from "../domain/invitations.types.js";

export type CreateInvitationRecord = Pick<
  NewInvitationRow,
  "email" | "expiresAt" | "organizationId" | "role"
>;

export class InvitationsRepository {
  constructor(private readonly db: DatabaseClient) {}

  async create(input: CreateInvitationRecord): Promise<InvitationRow> {
    const rows = await this.db.insert(invitationsTable).values(input).returning();
    const invitation = rows[0];

    if (invitation === undefined) {
      throw new Error("Invitation insert did not return a row.");
    }

    return invitation;
  }

  async findPendingByOrganizationIdAndEmail(input: {
    email: InvitationEmail;
    organizationId: OrganizationId;
  }): Promise<InvitationRow | null> {
    const rows = await this.db
      .select()
      .from(invitationsTable)
      .where(
        and(
          eq(invitationsTable.organizationId, input.organizationId),
          eq(invitationsTable.email, input.email),
          eq(invitationsTable.status, "pending"),
        ),
      )
      .limit(1);

    return rows[0] ?? null;
  }

  async findPendingById(id: InvitationId): Promise<InvitationRow | null> {
    const rows = await this.db
      .select()
      .from(invitationsTable)
      .where(and(eq(invitationsTable.id, id), eq(invitationsTable.status, "pending")))
      .limit(1);

    return rows[0] ?? null;
  }

  async acceptPendingById(input: {
    acceptedAt: Date;
    id: InvitationId;
  }): Promise<InvitationRow | null> {
    const rows = await this.db
      .update(invitationsTable)
      .set({
        acceptedAt: input.acceptedAt,
        status: "accepted",
        updatedAt: new Date(),
      })
      .where(and(eq(invitationsTable.id, input.id), eq(invitationsTable.status, "pending")))
      .returning();

    return rows[0] ?? null;
  }

  async revokePendingById(id: InvitationId): Promise<InvitationRow | null> {
    const rows = await this.db
      .update(invitationsTable)
      .set({
        status: "revoked",
        updatedAt: new Date(),
      })
      .where(and(eq(invitationsTable.id, id), eq(invitationsTable.status, "pending")))
      .returning();

    return rows[0] ?? null;
  }
}

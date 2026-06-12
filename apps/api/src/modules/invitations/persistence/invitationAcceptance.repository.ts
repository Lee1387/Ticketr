import { and, eq } from "drizzle-orm";

import type { DatabaseClient } from "../../../infrastructure/db/client.js";
import {
  invitationsTable,
  type InvitationRow,
  type NewInvitationRow,
} from "../../../infrastructure/db/schema/invitations.js";
import { organizationMembersTable } from "../../../infrastructure/db/schema/organizationMembers.js";
import type { OrganizationId } from "../../organizations/domain/organizations.types.js";
import type { UserId } from "../../users/domain/users.types.js";
import type { InvitationId } from "../domain/invitations.types.js";

export class InvitationAcceptanceRepository {
  constructor(private readonly db: DatabaseClient) {}

  async acceptPendingByIdAndCreateMembership(input: {
    acceptedAt: Date;
    id: InvitationId;
    organizationId: OrganizationId;
    role: NewInvitationRow["role"];
    userId: UserId;
  }): Promise<InvitationRow | null> {
    return this.db.transaction(async (transaction) => {
      const rows = await transaction
        .update(invitationsTable)
        .set({
          acceptedAt: input.acceptedAt,
          status: "accepted",
          updatedAt: new Date(),
        })
        .where(and(eq(invitationsTable.id, input.id), eq(invitationsTable.status, "pending")))
        .returning();
      const invitation = rows[0];

      if (invitation === undefined) {
        return null;
      }

      await transaction.insert(organizationMembersTable).values({
        organizationId: input.organizationId,
        role: input.role,
        userId: input.userId,
      });

      return invitation;
    });
  }
}

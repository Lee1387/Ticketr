import { and, desc, eq, lt } from "drizzle-orm";

import type { DatabaseClient } from "../../infrastructure/db/client.js";
import {
  ticketsTable,
  type NewTicketRow,
  type TicketRow,
} from "../../infrastructure/db/schema/tickets.js";
import type { OrganizationId } from "../organizations/organizations.types.js";
import type { TicketId, TicketStatus } from "./tickets.types.js";

export type CreateTicketRecord = Pick<
  NewTicketRow,
  "description" | "organizationId" | "priority" | "subject"
>;

export type UpdateTicketStatusRecord = {
  currentStatus: TicketStatus;
  id: TicketId;
  organizationId: OrganizationId;
  status: TicketStatus;
};

export class TicketsRepository {
  constructor(private readonly db: DatabaseClient) {}

  async listByOrganizationId(input: {
    organizationId: OrganizationId;
    limit: number;
    createdBefore?: Date;
  }): Promise<TicketRow[]> {
    return this.db
      .select()
      .from(ticketsTable)
      .where(
        input.createdBefore === undefined
          ? eq(ticketsTable.organizationId, input.organizationId)
          : and(
              eq(ticketsTable.organizationId, input.organizationId),
              lt(ticketsTable.createdAt, input.createdBefore),
            ),
      )
      .orderBy(desc(ticketsTable.createdAt))
      .limit(input.limit);
  }

  async findByOrganizationIdAndId(input: {
    id: TicketId;
    organizationId: OrganizationId;
  }): Promise<TicketRow | null> {
    const rows = await this.db
      .select()
      .from(ticketsTable)
      .where(
        and(eq(ticketsTable.id, input.id), eq(ticketsTable.organizationId, input.organizationId)),
      )
      .limit(1);

    return rows[0] ?? null;
  }

  async updateStatusByOrganizationIdAndId(
    input: UpdateTicketStatusRecord,
  ): Promise<TicketRow | null> {
    const rows = await this.db
      .update(ticketsTable)
      .set({
        status: input.status,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(ticketsTable.id, input.id),
          eq(ticketsTable.organizationId, input.organizationId),
          eq(ticketsTable.status, input.currentStatus),
        ),
      )
      .returning();

    return rows[0] ?? null;
  }

  async create(input: CreateTicketRecord): Promise<TicketRow> {
    const rows = await this.db.insert(ticketsTable).values(input).returning();
    const ticket = rows[0];

    if (ticket === undefined) {
      throw new Error("Ticket insert did not return a row.");
    }

    return ticket;
  }
}

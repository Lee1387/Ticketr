import { index, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import {
  ticketPriorityValues,
  ticketStatusValues,
} from "../../../modules/tickets/tickets.constants.js";
import { organizationsTable } from "./organizations.js";

export const ticketStatusEnum = pgEnum("ticket_status", ticketStatusValues);

export const ticketPriorityEnum = pgEnum("ticket_priority", ticketPriorityValues);

export const ticketsTable = pgTable(
  "tickets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizationsTable.id, { onDelete: "cascade" }),
    subject: varchar("subject", { length: 160 }).notNull(),
    description: text("description").notNull(),
    status: ticketStatusEnum("status").default("open").notNull(),
    priority: ticketPriorityEnum("priority").default("normal").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("tickets_organization_id_created_at_idx").on(table.organizationId, table.createdAt),
  ],
);

export type TicketRow = typeof ticketsTable.$inferSelect;

export type NewTicketRow = typeof ticketsTable.$inferInsert;

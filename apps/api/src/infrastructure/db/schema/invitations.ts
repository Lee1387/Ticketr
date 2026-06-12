import { sql } from "drizzle-orm";
import { index, pgEnum, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

import { invitationStatusValues } from "../../../modules/invitations/domain/invitations.constants.js";
import { organizationMemberRoleEnum } from "./organizationMembers.js";
import { organizationsTable } from "./organizations.js";

export const invitationStatusEnum = pgEnum("invitation_status", invitationStatusValues);

export const invitationsTable = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizationsTable.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 320 }).notNull(),
    role: organizationMemberRoleEnum("role").notNull(),
    status: invitationStatusEnum("status").default("pending").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("invitations_organization_id_status_idx").on(table.organizationId, table.status),
    uniqueIndex("invitations_organization_id_email_pending_unique")
      .on(table.organizationId, table.email)
      .where(sql`${table.status} = 'pending'`),
  ],
);

export type InvitationRow = typeof invitationsTable.$inferSelect;

export type NewInvitationRow = typeof invitationsTable.$inferInsert;

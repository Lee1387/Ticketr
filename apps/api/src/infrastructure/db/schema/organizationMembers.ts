import { index, pgEnum, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { organizationMemberRoleValues } from "../../../modules/organizations/organizations.constants.js";
import { organizationsTable } from "./organizations.js";
import { usersTable } from "./users.js";

export const organizationMemberRoleEnum = pgEnum(
  "organization_member_role",
  organizationMemberRoleValues,
);

export const organizationMembersTable = pgTable(
  "organization_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizationsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    role: organizationMemberRoleEnum("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("organization_members_organization_id_idx").on(table.organizationId),
    uniqueIndex("organization_members_organization_id_user_id_unique").on(
      table.organizationId,
      table.userId,
    ),
  ],
);

export type OrganizationMemberRow = typeof organizationMembersTable.$inferSelect;

export type NewOrganizationMemberRow = typeof organizationMembersTable.$inferInsert;

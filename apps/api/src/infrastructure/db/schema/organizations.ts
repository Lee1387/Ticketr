import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { organizationStatusValues } from "../../../modules/organizations/domain/organizations.constants.js";

export const organizationStatusEnum = pgEnum("organization_status", organizationStatusValues);

export const organizationsTable = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 160 }).notNull(),
  status: organizationStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type OrganizationRow = typeof organizationsTable.$inferSelect;

export type NewOrganizationRow = typeof organizationsTable.$inferInsert;

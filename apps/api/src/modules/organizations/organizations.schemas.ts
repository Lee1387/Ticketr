import { z } from "zod";

export const organizationStatusValues = ["active", "suspended"] as const;

export const organizationMemberRoleValues = ["owner", "admin", "agent"] as const;

export const organizationIdSchema = z.uuid();

export const organizationStatusSchema = z.enum(organizationStatusValues);

export const organizationMemberRoleSchema = z.enum(organizationMemberRoleValues);

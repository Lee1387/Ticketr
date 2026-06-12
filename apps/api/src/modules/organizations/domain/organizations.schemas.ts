import { z } from "zod";

import {
  organizationMemberRoleValues,
  organizationStatusValues,
} from "../domain/organizations.constants.js";

export { organizationMemberRoleValues, organizationStatusValues };

export const organizationIdSchema = z.uuid();

export const organizationStatusSchema = z.enum(organizationStatusValues);

export const organizationMemberRoleSchema = z.enum(organizationMemberRoleValues);

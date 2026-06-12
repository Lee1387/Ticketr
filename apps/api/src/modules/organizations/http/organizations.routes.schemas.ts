import { z } from "zod";

import {
  listOrganizationMembersQuerySchema,
  organizationIdSchema,
} from "../domain/organizations.schemas.js";

export const getOrganizationRequestSchema = z.object({
  body: z.undefined(),
  params: z.object({
    organizationId: organizationIdSchema,
  }),
  query: z.object({}),
});

export const listOrganizationMembersRequestSchema = z.object({
  body: z.undefined(),
  params: z.object({
    organizationId: organizationIdSchema,
  }),
  query: listOrganizationMembersQuerySchema,
});

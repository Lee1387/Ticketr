import { z } from "zod";

import {
  listOrganizationMembersQuerySchema,
  organizationIdSchema,
  updateOrganizationMemberRoleSchema,
} from "../domain/organizations.schemas.js";
import { userIdSchema } from "../../users/domain/users.schemas.js";

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

export const updateOrganizationMemberRoleRequestSchema = z.object({
  body: updateOrganizationMemberRoleSchema,
  params: z.object({
    organizationId: organizationIdSchema,
    userId: userIdSchema,
  }),
  query: z.object({}),
});

export const deactivateOrganizationMemberRequestSchema = z.object({
  body: z.undefined(),
  params: z.object({
    organizationId: organizationIdSchema,
    userId: userIdSchema,
  }),
  query: z.object({}),
});

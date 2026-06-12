import { vi } from "vitest";

import type {
  InvitationMembershipLookup,
  InvitationOrganizationLookup,
  InvitationUserLookup,
} from "../../service/invitations.service.ports.js";
import {
  invitationServiceTestInvitation,
  invitationServiceTestOrganizationId,
  invitationServiceTestUserId,
} from "./invitations.service.fixtures.js";

export const activeInvitationOrganizationLookup: InvitationOrganizationLookup = {
  findById: vi.fn(() =>
    Promise.resolve({
      id: invitationServiceTestOrganizationId,
      status: "active" as const,
    }),
  ),
};

export const missingInvitationOrganizationLookup: InvitationOrganizationLookup = {
  findById: vi.fn(() => Promise.resolve(null)),
};

export const activeInvitationUserLookup: InvitationUserLookup = {
  findById: vi.fn(() =>
    Promise.resolve({
      email: invitationServiceTestInvitation.email,
      id: invitationServiceTestUserId,
      status: "active" as const,
    }),
  ),
};

export const missingInvitationUserLookup: InvitationUserLookup = {
  findById: vi.fn(() => Promise.resolve(null)),
};

export const emptyInvitationMembershipLookup: InvitationMembershipLookup = {
  findByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
};

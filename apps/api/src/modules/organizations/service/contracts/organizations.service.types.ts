import type {
  ListOrganizationMembersQueryInput,
  OrganizationId,
  OrganizationMemberRole,
  UpdateOrganizationMemberRoleInput,
} from "../../domain/organizations.types.js";
import type {
  Organization,
  OrganizationMember,
  OrganizationMemberRoleAssignment,
  OrganizationMemberStatusAssignment,
} from "./organizations.service.models.js";
import type { UserId } from "../../../users/domain/users.types.js";

export type GetOrganizationQuery = {
  organizationId: OrganizationId;
};

export type GetOrganizationResult =
  | {
      status: "not-found";
      message: string;
    }
  | {
      status: "found";
      organization: Organization;
    };

export type ListOrganizationMembersQuery = {
  organizationId: OrganizationId;
  query: ListOrganizationMembersQueryInput;
};

export type ListOrganizationMembersResult =
  | {
      status: "not-found";
      message: string;
    }
  | {
      status: "found";
      members: OrganizationMember[];
    };

export type UpdateOrganizationMemberRoleCommand = {
  actorRole: OrganizationMemberRole;
  input: UpdateOrganizationMemberRoleInput;
  organizationId: OrganizationId;
  userId: UserId;
};

export type UpdateOrganizationMemberRoleResult =
  | {
      status: "organization-not-found";
      message: string;
    }
  | {
      status: "member-not-found";
      message: string;
    }
  | {
      status: "forbidden";
      message: string;
    }
  | {
      status: "conflict";
      message: string;
    }
  | {
      status: "updated";
      member: OrganizationMemberRoleAssignment;
    };

export type DeactivateOrganizationMemberCommand = {
  actorRole: OrganizationMemberRole;
  organizationId: OrganizationId;
  userId: UserId;
};

export type DeactivateOrganizationMemberResult =
  | {
      status: "organization-not-found";
      message: string;
    }
  | {
      status: "member-not-found";
      message: string;
    }
  | {
      status: "forbidden";
      message: string;
    }
  | {
      status: "conflict";
      message: string;
    }
  | {
      status: "deactivated";
      member: OrganizationMemberStatusAssignment;
    };

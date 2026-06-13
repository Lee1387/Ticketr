import { deactivateOrganizationMember } from "./members/deactivation/deactivateOrganizationMember.service.js";
import { listOrganizationMembers } from "./members/list/listOrganizationMembers.service.js";
import { getOrganization } from "./organizations/get/getOrganization.service.js";
import type {
  OrganizationMemberRoleLookupPort,
  OrganizationMemberRoleUpdaterPort,
  OrganizationMemberStatusUpdaterPort,
  OrganizationMembersReaderPort,
  OrganizationsRepositoryPort,
} from "./contracts/organizations.service.ports.js";
import type {
  DeactivateOrganizationMemberCommand,
  DeactivateOrganizationMemberResult,
  GetOrganizationQuery,
  GetOrganizationResult,
  ListOrganizationMembersQuery,
  ListOrganizationMembersResult,
  UpdateOrganizationMemberRoleCommand,
  UpdateOrganizationMemberRoleResult,
} from "./contracts/organizations.service.types.js";
import { updateOrganizationMemberRole } from "./members/role/updateOrganizationMemberRole.service.js";

export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepositoryPort,
    private readonly organizationMembersReader: OrganizationMembersReaderPort,
    private readonly organizationMemberRoleLookup: OrganizationMemberRoleLookupPort,
    private readonly organizationMemberRoleUpdater: OrganizationMemberRoleUpdaterPort,
    private readonly organizationMemberStatusUpdater: OrganizationMemberStatusUpdaterPort,
  ) {}

  async getOrganization(query: GetOrganizationQuery): Promise<GetOrganizationResult> {
    return getOrganization(query, {
      organizationsRepository: this.organizationsRepository,
    });
  }

  async listOrganizationMembers(
    query: ListOrganizationMembersQuery,
  ): Promise<ListOrganizationMembersResult> {
    return listOrganizationMembers(query, {
      organizationMembersReader: this.organizationMembersReader,
      organizationsRepository: this.organizationsRepository,
    });
  }

  async updateOrganizationMemberRole(
    command: UpdateOrganizationMemberRoleCommand,
  ): Promise<UpdateOrganizationMemberRoleResult> {
    return updateOrganizationMemberRole(command, {
      organizationMemberRoleLookup: this.organizationMemberRoleLookup,
      organizationMemberRoleUpdater: this.organizationMemberRoleUpdater,
      organizationsRepository: this.organizationsRepository,
    });
  }

  async deactivateOrganizationMember(
    command: DeactivateOrganizationMemberCommand,
  ): Promise<DeactivateOrganizationMemberResult> {
    return deactivateOrganizationMember(command, {
      organizationMemberRoleLookup: this.organizationMemberRoleLookup,
      organizationMemberStatusUpdater: this.organizationMemberStatusUpdater,
      organizationsRepository: this.organizationsRepository,
    });
  }
}

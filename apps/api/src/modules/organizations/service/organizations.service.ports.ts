import type { OrganizationId } from "../domain/organizations.types.js";
import type { Organization } from "./organizations.service.models.js";

export type OrganizationsRepositoryPort = {
  findById: (id: OrganizationId) => Promise<Organization | null>;
};

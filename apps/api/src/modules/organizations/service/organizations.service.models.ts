import type { OrganizationId, OrganizationStatus } from "../domain/organizations.types.js";

export type Organization = {
  id: OrganizationId;
  name: string;
  status: OrganizationStatus;
  createdAt: Date;
  updatedAt: Date;
};

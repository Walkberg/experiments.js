import { OrganizationId } from "../../types/common";

export type Organization = {
  id: OrganizationId;
  name: string;
  creationDate: string;
  lastUpdateDate: string;
};

export type OrganizationNew = {
  name: string;
};

export interface OrganizationClient {
  getOrganization(organizationId: string): Promise<Organization>;

  getOrganizations(search?: string): Promise<Organization[]>;

  createOrganization(orgNew: OrganizationNew): Promise<Organization>;
}

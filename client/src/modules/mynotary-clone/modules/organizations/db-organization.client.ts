import { db } from "../local-db/db";
import { v4 as uuidv4 } from "uuid";
import {
  Organization,
  OrganizationClient,
  OrganizationNew,
} from "./organization";
import { OrganizationDb } from "../local-db/db.type";

export class DbOrganizationClient implements OrganizationClient {
  async getOrganization(organizationId: string): Promise<Organization> {
    const org = await db.organizations.get(organizationId);
    if (!org) throw new Error(`Organization ${organizationId} not found`);
    return convertOrganizationDbToOrganization(org);
  }

  async getOrganizations(search?: string): Promise<Organization[]> {
    const orgs = await db.organizations.toArray();
    return orgs.map(convertOrganizationDbToOrganization);
  }

  async createOrganization(orgNew: OrganizationNew): Promise<Organization> {
    const now = new Date().toISOString();
    const organization: OrganizationDb = {
      id: uuidv4(),
      name: orgNew.name,
      creationDate: now,
      lastUpdateDate: now,
    };

    await db.organizations.add(organization);
    return convertOrganizationDbToOrganization(organization);
  }
}

function convertOrganizationDbToOrganization(
  orgDb: OrganizationDb
): Organization {
  return {
    ...orgDb,
  };
}

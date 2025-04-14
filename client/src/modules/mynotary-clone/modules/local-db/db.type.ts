import { IsoDate } from "../../types/common";

export type OperationIdDb = string;

export type ContractConfigIdDb = string;

export type ContractIdDb = string;

export type BranchIdDb = string;

export type MemberIdDb = string;

export type OrganizationIdDb = string;

export type UserIdDb = string;

export type RecordIdDb = string;

export type OperationDb = {
  id: string;
  name: string;
  type: string;
  creatorId: UserIdDb;
  organizationId: OrganizationIdDb;
};

export type ContractConfigDb = {
  id: string;
  type: string;
  availableLinks: LinkConfigDb[];
};

export type ContractDb = {
  id: string;
  name: string;
  templateId: string;
  operationId: string;
};

export type MemberDb = {
  id: MemberIdDb;
  email: string;
  organizationId: OrganizationIdDb;
  creationDate: IsoDate;
  lastUpdateDate: IsoDate;
};

export type OrganizationDb = {
  id: OrganizationIdDb;
  name: string;
  creationDate: IsoDate;
  lastUpdateDate: IsoDate;
};

export type UserDb = {
  id: UserIdDb;
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  avatarUrl?: string;
  creationDate: IsoDate;
  lastUpdateDate: IsoDate;
};

export type BranchDb = {
  id: BranchIdDb;
};

export type RecordDb = {
  id: string;
  creatorId: UserIdDb;
  organizationId: OrganizationIdDb;
  type: string;
  creationDate: IsoDate;
  lastUpdateDate: IsoDate;
};

export interface LinkConfigDb {
  id: string;
  type: string;
  acceptedTemplateIds: string[];
  creation: BranchConfigCreation;
}

export interface BranchConfigCreation {
  maxRecordCount?: number;
  isAutoCreate?: boolean;
}

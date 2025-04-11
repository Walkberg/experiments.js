import Dexie, { Table } from "dexie";
import {
  BranchDb,
  ContractConfigDb,
  ContractDb,
  MemberDb,
  OperationDb,
  OrganizationDb,
  RecordDb,
  UserDb,
} from "./db.type";

export class MyAppDB extends Dexie {
  operations!: Table<OperationDb, string>;
  contractConfigs!: Table<ContractConfigDb, string>;
  contracts!: Table<ContractDb, string>;
  members!: Table<MemberDb, string>;
  organizations!: Table<OrganizationDb, string>;
  users!: Table<UserDb, string>;
  branches!: Table<BranchDb, string>;
  records!: Table<RecordDb, string>;

  constructor() {
    super("MyAppDB");
    this.version(1).stores({
      operations: "id, organizationId, creatorId, type",
      contracts: "id, operationId, templateId",
      contractConfigs: "id",
      members: "id, organizationId, userId",
      organizations: "id",
      users: "id , email",
      branches: "id",
      records: "id, creatorId, organizationId",
    });
  }
}

export const db = new MyAppDB();

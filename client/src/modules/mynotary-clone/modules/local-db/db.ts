import Dexie, { Table } from "dexie";
import { ContractConfig } from "../redaction/redaction";
import { Operation } from "../operations/operation";
import { Contract } from "../contracts/contract";
import { Member } from "../members/members";

export class MyAppDB extends Dexie {
  operations!: Table<Operation, string>;
  contractConfigs!: Table<ContractConfig, string>;
  contracts!: Table<Contract, string>;
  members!: Table<Member, string>;

  constructor() {
    super("MyAppDB");
    this.version(1).stores({
      operations: "id, organizationId, creatorId, type",
      contracts: "id, operationId, templateId",
      contractConfigs: "id",
      members: "id, organizationId, userId",
    });
  }
}

export const db = new MyAppDB();

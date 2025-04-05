import Dexie, { Table } from "dexie";
import { ContractConfig, LinkConfig } from "../redaction/redaction";
import { Operation } from "../operations/operation";
import { Contract } from "../contracts/contract";

export class MyAppDB extends Dexie {
  operations!: Table<Operation, string>;
  contractConfigs!: Table<ContractConfig, string>;
  contracts!: Table<Contract, string>;

  constructor() {
    super("MyAppDB");
    this.version(1).stores({
      operations: "id, organizationId, creatorId, type",
      contracts: "id, operationId, templateId",
      contractConfigs: "id",
    });
  }
}

export const db = new MyAppDB();

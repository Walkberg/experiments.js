import { db } from "../local-db/db";
import {
  Contract,
  ContractClient,
  ContractFiltering,
  ContractNew,
} from "./contract";
import { v4 as uuidv4 } from "uuid";

export class DbContractClient implements ContractClient {
  async getContract(id: string): Promise<Contract> {
    const contract = await db.contracts.get(id);
    if (!contract) throw new Error(`Contract ${id} not found`);
    return contract;
  }

  async getContracts(filtering: ContractFiltering): Promise<Contract[]> {
    return await db.contracts
      .where("operationId")
      .equals(filtering.operationId)
      .toArray();
  }

  async createContract(contractNew: ContractNew): Promise<Contract> {
    const operation = await db.operations.get(contractNew.operationId);

    if (!operation)
      throw new Error(`Operation ${contractNew.operationId} not found`);

    const contract: Contract = {
      ...contractNew,
      id: uuidv4(),
    };

    await db.contracts.add(contract);
    return contract;
  }
}

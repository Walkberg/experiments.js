import {
  Contract,
  ContractFiltering,
  ContractClient,
  ContractCreated,
  ContractNew,
} from "./contract";

const initialValues = [
  { id: "uij", name: "test", operationId: "operation-1" },
  { id: "uij", name: "test", operationId: "operation-1" },
  { id: "uij", name: "test", operationId: "operation-1" },
  { id: "uij", name: "test", operationId: "operation-1" },
];

export class FakeContractClient implements ContractClient {
  private contracts: Contract[] = initialValues;

  async getContract(id: string): Promise<Contract> {
    const contract = this.contracts.find((c) => c.id === id);

    if (!contract) {
      throw new Error("Contrat non trouvé");
    }

    return contract;
  }

  async getContracts(filtering: ContractFiltering): Promise<Contract[]> {
    const filteredContracts = this.contracts.filter(
      (c) => c.operationId === filtering.operationId
    );
    return filteredContracts;
  }

  async createContract(contractNew: ContractNew): Promise<ContractCreated> {
    const id = "";

    this.contracts.push({
      id: id,
      name: contractNew.name,
      operationId: contractNew.operationId,
    });

    return { id: id };
  }
}

import { Contract, ContractFiltering, ContractClient } from "./contract"; 

const initialValues = [
  { id: "uij", name: 'test', operationId: "operation-1" },
  { id: "uij", name: 'test', operationId: "operation-1" },
  { id: "uij", name: 'test', operationId: "operation-1" },
  { id: "uij", name: 'test', operationId: "operation-1" },
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
}

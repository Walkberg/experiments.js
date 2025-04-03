import {
  Contract,
  ContractFiltering,
  ContractClient,
  ContractNew,
} from "./contract";

const initialValues = [
  {
    id: "uij",
    name: "test",
    operationId: "operation-1",
    templateId: "vente-ancien",
  },
  {
    id: "uij",
    name: "test",
    operationId: "operation-1",
    templateId: "vente-ancien",
  },
  {
    id: "uij",
    name: "test",
    operationId: "operation-1",
    templateId: "vente-ancien",
  },
  {
    id: "uij",
    name: "test",
    operationId: "operation-1",
    templateId: "vente-ancien",
  },
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

  async createContract(contractNew: ContractNew): Promise<Contract> {
    const id = contractNew.name;

    const contract = {
      id: id,
      name: contractNew.name,
      operationId: contractNew.operationId,
      templateId: contractNew.templateId,
    };

    this.contracts.push(contract);

    return contract;
  }
}

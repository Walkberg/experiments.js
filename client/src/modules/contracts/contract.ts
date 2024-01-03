export interface Contract {
  id: string;
  name: string;
  operationId: string;
}

export interface ContractFiltering {
  operationId: string;
}

export interface ContractClient {
  getContract: (id: string) => Promise<Contract>;
  getContracts: (filtering: ContractFiltering) => Promise<Contract[]>;
}

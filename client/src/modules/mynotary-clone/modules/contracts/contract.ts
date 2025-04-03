export interface Contract {
  id: string;
  name: string;
  templateId: string;
  operationId: string;
}

export interface ContractFiltering {
  operationId: string;
}

export interface ContractNew {
  name: string;
  templateId: string;
  operationId: string;
}

export interface ContractCreated {
  id: string;
}

export interface ContractClient {
  getContract: (id: string) => Promise<Contract>;
  getContracts: (filtering: ContractFiltering) => Promise<Contract[]>;
  createContract: (contractNew: ContractNew) => Promise<Contract>;
}

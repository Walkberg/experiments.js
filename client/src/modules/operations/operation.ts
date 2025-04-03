import {
  ContractConfig,
  ContractConfigNew,
  ContractConfigUpdate,
  LinkConfig,
} from "../redaction/redaction";

export interface Operation {
  id: string;
}

export interface OperationClient {
  getOperation: (operationId: string) => Promise<Operation>;
}

export interface OperationConfigsClient {
  getOperationConfigs: () => Promise<ContractConfig[]>;

  createOperationConfig: (config: ContractConfigNew) => Promise<ContractConfig>;

  updateOperationConfig: (config: ContractConfigUpdate) => Promise<void>;

  deleteOperationConfig: (configId: string) => Promise<void>;

  addLinkConfig: (configId: string, link: LinkConfig) => Promise<void>;

  removeLinkConfig: (configId: string, linkId: string) => Promise<void>;
}

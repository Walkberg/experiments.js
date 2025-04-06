import {
  ContractConfig,
  ContractConfigNew,
  ContractConfigUpdate,
  LinkConfig,
} from "../redaction/redaction";

type OrganizationId = string;

type TemplateId = string;

type UserId = string;

export interface Operation {
  id: string;
  name: string;
  type: TemplateId;
  creatorId: UserId;
  organizationId: OrganizationId;
}

export interface OperationNew {
  name: string;
  type: TemplateId;
  organizationId: OrganizationId;
  creatorId: UserId;
}

export interface OperationFiltering {
  search?: string;
  templateIds?: TemplateId[];
  organizationId: OrganizationId;
  archived?: boolean;
}

export interface OperationClient {
  getOperation: (operationId: string) => Promise<Operation>;

  getOperations: (filtering: OperationFiltering) => Promise<Operation[]>;

  createOperation: (operation: OperationNew) => Promise<Operation>;

  updateOperation: (operation: Operation) => Promise<void>;

  deleteOperation: (operationId: string) => Promise<void>;
}

export interface ContractConfigsClient {
  getContractConfigs: () => Promise<ContractConfig[]>;

  createContractConfig: (config: ContractConfigNew) => Promise<ContractConfig>;

  updateContractConfig: (config: ContractConfigUpdate) => Promise<void>;

  deleteContractConfig: (configId: string) => Promise<void>;

  addLinkConfig: (configId: string, link: LinkConfig) => Promise<void>;

  removeLinkConfig: (configId: string, linkId: string) => Promise<void>;
}

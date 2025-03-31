import { OperationConfig } from "../redaction/redaction";

export interface Operation {
  id: string;
}

export interface OperationClient {
  getOperation: (operationId: string) => Promise<Operation>;
}

export interface OperationConfigsClient {
  getOperationConfigs: () => Promise<OperationConfig[]>;
}

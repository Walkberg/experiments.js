export interface Operation {
  id: string;
}

export interface OperationClient {
  getOperation: (operationId: string) => Promise<Operation>;
}

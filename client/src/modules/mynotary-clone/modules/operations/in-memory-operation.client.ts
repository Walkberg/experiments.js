import {
  Operation,
  OperationClient,
  OperationFiltering,
  OperationNew,
} from "./operation";

const initialValues = createFakeOperations(10);

export class FakeOperationClient implements OperationClient {
  private operations: Operation[] = initialValues;

  async getOperation(operationId: string): Promise<Operation> {
    const operation = this.operations.find((op) => op.id === operationId);

    if (!operation) {
      throw new Error("Opération non trouvée");
    }

    return operation;
  }

  async getOperations(filtering: OperationFiltering): Promise<Operation[]> {
    return this.operations.filter(
      (op) => op.organizationId === filtering.organizationId
    );
  }

  async createOperation(operation: OperationNew): Promise<Operation> {
    const newOperation: Operation = {
      id: `operation-${this.operations.length + 1}`,
      ...operation,
    };
    this.operations.push(newOperation);
    return newOperation;
  }

  async updateOperation(operation: Operation): Promise<void> {
    const index = this.operations.findIndex((op) => op.id === operation.id);
    if (index === -1) throw new Error("Opération non trouvée");
    this.operations[index] = operation;
  }

  async deleteOperation(operationId: string): Promise<void> {
    this.operations = this.operations.filter((op) => op.id !== operationId);
  }
}

function createFakeOperations(n: number): Operation[] {
  const operations: Operation[] = [];
  for (let i = 0; i < n; i++) {
    operations.push({
      id: `operation-${operations.length + 1}`,
      name: `Fake Operation ${operations.length + 1}`,
      type: `template-${Math.ceil(Math.random() * 10)}`,
      creatorId: `user-${Math.ceil(Math.random() * 5)}`,
      organizationId: `1`,
    });
  }

  return operations;
}

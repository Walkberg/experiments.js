import { Operation, OperationClient } from "./operation";

const initialValues = [{ id: "operation-1" }, { id: "operation-2" }];

export class FakeOperationClient implements OperationClient {
  private operations: Operation[] = initialValues;

  async getOperation(operationId: string): Promise<Operation> {
    const operation = this.operations.find((op) => op.id === operationId);

    if (!operation) {
      throw new Error("Opération non trouvée");
    }

    return operation;
  }
}

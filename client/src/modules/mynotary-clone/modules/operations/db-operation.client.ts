import { db } from "../local-db/db";
import {
  Operation,
  OperationClient,
  OperationFiltering,
  OperationNew,
} from "./operation";
import { v4 as uuidv4 } from "uuid";

export class DbOperationClient implements OperationClient {
  async getOperation(operationId: string): Promise<Operation> {
    const op = await db.operations.get(operationId);
    if (!op) throw new Error(`Operation ${operationId} not found`);
    return op;
  }

  async getOperations(filtering: OperationFiltering): Promise<Operation[]> {
    let query = db.operations
      .where("organizationId")
      .equals(filtering.organizationId);

    return await query.toArray();
  }

  async createOperation(operation: OperationNew): Promise<Operation> {
    const newOp: Operation = {
      ...operation,
      id: uuidv4(),
    };

    await db.operations.add(newOp);
    return newOp;
  }

  async updateOperation(operation: Operation): Promise<void> {
    const exists = await db.operations.get(operation.id);
    if (!exists) throw new Error(`Operation ${operation.id} not found`);
    await db.operations.put(operation);
  }

  async deleteOperation(operationId: string): Promise<void> {
    await db.operations.delete(operationId);
  }
}

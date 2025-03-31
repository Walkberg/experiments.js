import { fakeConfig, OperationConfig } from "../redaction/redaction";
import { OperationConfigsClient } from "./operation";

export class FakeOperationConfigClient implements OperationConfigsClient {
  private operationConfigs: OperationConfig[] = [fakeConfig];

  async getOperationConfigs(): Promise<OperationConfig[]> {
    return this.operationConfigs;
  }
}

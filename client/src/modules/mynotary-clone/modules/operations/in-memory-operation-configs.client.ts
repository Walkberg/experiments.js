import {
  fakeConfig,
  ContractConfig,
  ContractConfigNew,
  ContractConfigUpdate,
  LinkConfig,
} from "../redaction/redaction";
import { ContractConfigsClient } from "./operation";

export class FakeContractConfigClient implements ContractConfigsClient {
  private operationConfigs: ContractConfig[] = [fakeConfig];

  async createContractConfig(config: ContractConfigNew) {
    const newConfig: ContractConfig = {
      id: config.id,
      type: config.type,
      availableLinks: [],
    };
    this.operationConfigs.push(newConfig);
    return newConfig;
  }

  async updateContractConfig(config: ContractConfigUpdate) {
    const index = this.operationConfigs.findIndex(
      (cfg) => cfg.id === config.id
    );
    if (index !== -1) {
      this.operationConfigs[index] = {
        ...this.operationConfigs[index],
        ...config,
      };
    }
  }

  async deleteContractConfig(configId: string) {
    this.operationConfigs = this.operationConfigs.filter(
      (config) => config.id !== configId
    );
  }

  async getContractConfigs(): Promise<ContractConfig[]> {
    return this.operationConfigs;
  }

  async addLinkConfig(configId: string, newLink: LinkConfig) {
    const config = this.operationConfigs.find((cfg) => cfg.id === configId);
    if (config) {
      config.availableLinks.push(newLink);
    }
  }

  async removeLinkConfig(configId: string, linkId: string) {
    const config = this.operationConfigs.find((cfg) => cfg.id === configId);
    if (config) {
      config.availableLinks = config.availableLinks.filter(
        (linkConfig) => linkConfig.id !== linkId
      );
    }
  }
}

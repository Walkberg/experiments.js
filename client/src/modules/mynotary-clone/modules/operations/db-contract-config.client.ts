import { db } from "../local-db/db";
import {
  ContractConfig,
  ContractConfigNew,
  ContractConfigUpdate,
  LinkConfig,
} from "../redaction/redaction";
import { ContractConfigsClient } from "./operation"; // ou le bon chemin

import { v4 as uuidv4 } from "uuid";

export class DbContractConfigsClient implements ContractConfigsClient {
  async getContractConfigs(): Promise<ContractConfig[]> {
    return await db.contractConfigs.toArray();
  }

  async createContractConfig(
    config: ContractConfigNew
  ): Promise<ContractConfig> {
    const newConfig: ContractConfig = {
      ...config,
      id: uuidv4(),
      availableLinks: [],
    };
    await db.contractConfigs.add(newConfig);
    return newConfig;
  }

  async updateContractConfig(config: ContractConfigUpdate): Promise<void> {
    const existing = await db.contractConfigs.get(config.id);
    if (!existing) throw new Error(`ContractConfig ${config.id} not found`);
    await db.contractConfigs.put({ ...existing, ...config });
  }

  async deleteContractConfig(configId: string): Promise<void> {
    await db.contractConfigs.delete(configId);
  }

  async addLinkConfig(configId: string, link: LinkConfig): Promise<void> {
    console.log("Adding link config", configId, link);
    const config = await db.contractConfigs.get(configId);
    if (!config) throw new Error(`ContractConfig ${configId} not found`);
    console.log("Adding link config", configId, link);
    const updated = {
      ...config,
      availableLinks: [...(config.availableLinks || []), link],
    };
    console.log("Adding link config", configId, updated);
    await db.contractConfigs.put(updated);
  }

  async removeLinkConfig(configId: string, linkId: string): Promise<void> {
    const config = await db.contractConfigs.get(configId);
    if (!config) throw new Error(`ContractConfig ${configId} not found`);
    const updated = {
      ...config,
      links: (config.availableLinks || []).filter((link) => link.id !== linkId),
    };
    await db.contractConfigs.put(updated);
  }
}

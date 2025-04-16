import { db } from "../local-db/db";
import { v4 as uuidv4 } from "uuid";
import {
  RecordConfig,
  RecordConfigClient,
  RecordConfigId,
} from "./record-configs";
import { RecordConfigDb } from "../local-db/db.type";

export class DbRecordConfigClient implements RecordConfigClient {
  async getRecordConfigs(): Promise<RecordConfig[]> {
    const dbCofnigs = await db.recordConfigs.toArray();
    return dbCofnigs.map(convertRecordConfigToDbRecordConfig);
  }

  async getRecordConfig(id: RecordConfigId): Promise<RecordConfig> {
    const config = await db.recordConfigs.get(id);
    if (!config) {
      throw new Error(`RecordConfig with id ${id} not found.`);
    }
    return convertRecordConfigToDbRecordConfig(config);
  }

  async createRecordConfig(
    config: Omit<RecordConfig, "id">
  ): Promise<RecordConfig> {
    const newConfig: RecordConfig = {
      ...config,
      id: uuidv4(),
    };

    await db.recordConfigs.add(newConfig);
    return newConfig;
  }
}

function convertRecordConfigToDbRecordConfig(
  config: RecordConfigDb
): RecordConfig {
  return {
    ...config,
    type:
      config.type === "person" || config.type === "property"
        ? config.type
        : "person",
  };
}

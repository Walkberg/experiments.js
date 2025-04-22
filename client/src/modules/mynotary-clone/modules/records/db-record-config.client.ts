import { db } from "../local-db/db";
import { v4 as uuidv4 } from "uuid";
import {
  RecordConfig,
  RecordConfigClient,
  RecordConfigId,
  RecordConfigNew,
} from "./record-configs";
import { FormQuestion, RecordConfigDb } from "../local-db/db.type";

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

  async createRecordConfig(config: RecordConfigNew): Promise<RecordConfig> {
    const newConfig: RecordConfig = {
      ...config,
      id: uuidv4(),
      form: {
        questions: [],
      },
    };

    await db.recordConfigs.add(newConfig);
    return newConfig;
  }

  async addQuestionToRecordConfig(
    configId: RecordConfigId,
    question: FormQuestion
  ): Promise<RecordConfig> {
    console.log("Adding question to record config", configId, question);
    const config = await this.getRecordConfig(configId);

    const updatedConfig: RecordConfig = {
      ...config,
      form: {
        questions: [...(config.form?.questions ?? []), question],
      },
    };

    await db.recordConfigs.put(updatedConfig);
    return updatedConfig;
  }

  async removeQuestionFromRecordConfig(
    configId: RecordConfigId,
    questionId: string
  ): Promise<RecordConfig> {
    const config = await this.getRecordConfig(configId);

    const updatedQuestions = config.form.questions.filter(
      (q) => q.name !== questionId
    );

    const updatedConfig: RecordConfig = {
      ...config,
      form: {
        questions: updatedQuestions,
      },
    };

    await db.recordConfigs.put(updatedConfig);
    return updatedConfig;
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

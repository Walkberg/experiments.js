import { FormElement, FormType, QuestionType } from "../form/form";

export type RecordConfigId = string;

export type RecordConfigType = "person" | "property";

export type RecordFormConfig = FormType;

export type RecordConfig = {
  id: RecordConfigId;
  label: string;
  type: RecordConfigType;
  form: RecordFormConfig;
};

export type RecordConfigNew = {
  label: string;
  type: RecordConfigType;
};

export interface RecordConfigClient {
  getRecordConfigs: () => Promise<RecordConfig[]>;

  getRecordConfig: (id: RecordConfigId) => Promise<RecordConfig>;

  createRecordConfig: (config: RecordConfigNew) => Promise<RecordConfig>;

  addQuestionToRecordConfig: (
    configId: RecordConfigId,
    question: FormElement
  ) => Promise<RecordConfig>;

  removeQuestionFromRecordConfig: (
    configId: RecordConfigId,
    questionId: string
  ) => Promise<RecordConfig>;
}

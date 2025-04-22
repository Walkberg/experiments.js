import { getRandomInt } from "@/utils/random";
import { FormType } from "../form/form";

export interface Recorde {
  id: string;
  creatorId: string;
  organizationId: string;
  type: string;
  answers: Record<QuestionId, AnswerType>;
}

type QuestionId = string;

type AnswerType = string | number | boolean;

export interface RecordLink {
  fromRecordId: string;
  toRecordId: string;
}

export type RecordNew = Omit<Recorde, "id">;

export interface RecordFiltering {
  search: string;
}

export interface RecordCreationProps {
  acceptedTemplateIds?: string[];
  onValidate: (recordId: string) => void;
}

export function createRandomRecords() {
  const count = getRandomInt(5);

  return Array.from(Array(count).keys()).map(createRandomRecord);
}

export function createRandomRecordNew(): RecordNew {
  return {
    type: "personne-physique",
    organizationId: "organization-1",
    creatorId: "user-1",
    answers: {},
  };
}

export function createRandomRecord(): Recorde {
  return {
    type: "personne-physique",
    id: `record-${getRandomInt(999999)}`,
    organizationId: "organization-1",
    creatorId: "user-1",
    answers: {},
  };
}

export interface RecordApi {
  createRecord(recordNew: RecordNew): Promise<Recorde>;

  getRecords(filtering: RecordFiltering): Promise<Recorde[]>;

  deleteRecord(recordId: string): Promise<void>;
}

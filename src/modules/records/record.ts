import { getRandomInt } from "@/utils/random";

export interface Recorde {
  id: string;
  creatorId: string;
  organizationId: string;
  templateId: string;
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
    templateId: "personne-physique",
    organizationId: "organization-1",
    creatorId: "user-1",
  };
}

export function createRandomRecord(): Recorde {
  return {
    templateId: "personne-physique",
    id: `record-${getRandomInt(999999)}`,
    organizationId: "organization-1",
    creatorId: "user-1",
  };
}

export interface RecordApi {
  createRecord(recordNew: RecordNew): Promise<Recorde>;
  getRecords(filtering: RecordFiltering): Promise<Recorde[]>;
}

interface RecordConfig {
  id: string;
  labelPattern: string;
  form: FormConfig;
}

export interface FormConfig {
  questions: Question[];
}

export interface Question {
  id: string;
  name: string;
  type: QuestionType;
}

type QuestionType = "text" | "number";

export const personnePhysiqueConfig: RecordConfig = {
  id: "personne-physique",
  labelPattern: "test",
  form: {
    questions: [
      { id: "firstname", type: "text", name: "Prénom" },
      { id: "lastname", type: "text", name: "Nom" },
      { id: "email", type: "text", name: "Email" },
      { id: "phone", type: "text", name: "Téléphone" },
    ],
  },
};

const bienConfig: RecordConfig = {
  id: "bien",
  labelPattern: "test",
  form: {
    questions: [{ id: "address", type: "text", name: "Adresse" }],
  },
};

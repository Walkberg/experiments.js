import { IsoDate } from "../../types/common";
import { FormType } from "../form/form";

export type OperationIdDb = string;

export type ContractConfigIdDb = string;

export type ContractIdDb = string;

export type BranchIdDb = string;

export type MemberIdDb = string;

export type OrganizationIdDb = string;

export type UserIdDb = string;

export type RecordIdDb = string;

export type OperationDb = {
  id: string;
  name: string;
  type: string;
  creatorId: UserIdDb;
  organizationId: OrganizationIdDb;
};

export type ContractConfigDb = {
  id: string;
  type: string;
  availableLinks: LinkConfigDb[];
};

export type ContractDb = {
  id: string;
  name: string;
  templateId: string;
  operationId: string;
};

export type MemberDb = {
  id: MemberIdDb;
  email: string;
  organizationId: OrganizationIdDb;
  creationDate: IsoDate;
  lastUpdateDate: IsoDate;
};

export type OrganizationDb = {
  id: OrganizationIdDb;
  name: string;
  creationDate: IsoDate;
  lastUpdateDate: IsoDate;
};

export type UserDb = {
  id: UserIdDb;
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  avatarUrl?: string;
  creationDate: IsoDate;
  lastUpdateDate: IsoDate;
};

export type BranchDb = {
  id: BranchIdDb;
};

export type RecordDb = {
  id: string;
  creatorId: UserIdDb;
  organizationId: OrganizationIdDb;
  type: string;
  answers: Answers;
  creationDate: IsoDate;
  lastUpdateDate: IsoDate;
};

type QuestionId = string;

type Answers = Record<QuestionId, Answer>;

type Answer = any;

export interface LinkConfigDb {
  id: string;
  type: string;
  acceptedTemplateIds: string[];
  creation: BranchConfigCreation;
}

export interface BranchConfigCreation {
  maxRecordCount?: number;
  isAutoCreate?: boolean;
}

export interface RecordConfigDb {
  id: string;
  type: string;
  label: string;
  form: FormDb;
}

type FormDb = {
  questions: FormQuestion[];
};

export type QuestionType = "string" | "number" | "boolean" | "select" | "user";

export type BaseQuestion = {
  type: QuestionType;
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
};

export type StringQuestion = { type: "string" } & BaseQuestion;

export type UserQuestion = { type: "user" } & BaseQuestion;

export type NumberQuestion = { type: "number" } & BaseQuestion;

export type BooleanQuestion = { type: "boolean" } & BaseQuestion;

export type SelectQuestion = {
  type: "select";
  options: { name: string; value: string }[];
} & BaseQuestion;

export type FormQuestion =
  | StringQuestion
  | NumberQuestion
  | BooleanQuestion
  | SelectQuestion
  | UserQuestion;

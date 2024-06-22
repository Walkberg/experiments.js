export type FormType = {
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

export type QuestionValueType<T extends FormQuestion> = T extends StringQuestion
  ? string
  : T extends NumberQuestion
  ? number
  : T extends BooleanQuestion
  ? boolean
  : T extends SelectQuestion
  ? string
  : T extends UserQuestion
  ? string
  : never;

export type FormValues<T extends FormType> = {
  [K in T["questions"][number] as K["name"]]: QuestionValueType<K>;
};

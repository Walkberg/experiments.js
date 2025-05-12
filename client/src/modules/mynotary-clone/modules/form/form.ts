export type FormType = {
  questions: FormElement[];
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

export type FormElement =
  | StringQuestion
  | NumberQuestion
  | BooleanQuestion
  | SelectQuestion
  | UserQuestion;

type ExtractQuestionValue<Q> = Q extends { type: "string" }
  ? string
  : Q extends { type: "number" }
  ? number
  : Q extends { type: "boolean" }
  ? boolean
  : Q extends { type: "select"; options: readonly { value: infer V }[] }
  ? V
  : Q extends { type: "user" }
  ? string
  : never;

export type FormValues<T extends { questions: readonly any[] }> = {
  [Q in T["questions"][number] as Q["name"]]: ExtractQuestionValue<Q>;
};

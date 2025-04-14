import { Checkbox } from "@/components/ui/checkbox";
import {
  FormQuestion,
  FormType,
  StringQuestion,
  NumberQuestion,
  BooleanQuestion,
  SelectQuestion,
  UserQuestion,
  FormValues,
} from "./form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createContext, useContext, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type FormDisplay = "column" | "row";

type FormResponse = FormValues<FormType>;

interface FormProps {
  form: FormType;
  display: FormDisplay;
  defaultValues?: FormResponse;
  onSubmit: (formResponse: FormResponse) => Promise<void> | void;
}

export const FormComponent = ({
  form,
  display,
  onSubmit,
  defaultValues,
}: FormProps) => {
  return (
    <FormProvider
      defaultValues={defaultValues}
      form={form}
      display={display}
      onSubmit={onSubmit}
    >
      <FormComponentLogic />
    </FormProvider>
  );
};

interface FormComponentLogicProps {}

export const FormComponentLogic = ({}: FormComponentLogicProps) => {
  const { form, submit, status, values } = useForm();

  return (
    <div>
      <form className="flex flex-col gap-4" onSubmit={submit}>
        {form.questions.map((question) => (
          <QuestionComponent key={question.name} {...question} />
        ))}

        <Button disabled={status === "submitting"} type="submit">
          Envoyer
        </Button>
      </form>
    </div>
  );
};

function QuestionComponent(question: FormQuestion) {
  switch (question.type) {
    case "string":
      return <StringQuestionComponent {...question} />;
    case "number":
      return <NumberQuestionComponent {...question} />;
    case "boolean":
      return <BooleanQuestionComponent {...question} />;
    case "select":
      return <SelectQuestionComponent {...question} />;
    case "user":
      return <UserQuestionComponent {...question} />;
  }
}

export const StringQuestionComponent = ({
  name,
  label,
  placeholder,
}: StringQuestion) => {
  return (
    <QuestionContainer>
      <Label htmlFor={name}>{label}</Label>
      <Input type="text" id={name} placeholder={placeholder} />
    </QuestionContainer>
  );
};

export const NumberQuestionComponent = ({
  name,
  label,
  placeholder,
}: NumberQuestion) => {
  return (
    <QuestionContainer>
      <Label htmlFor={name}>{label}</Label>
      <Input type="number" id={name} placeholder={placeholder} />
    </QuestionContainer>
  );
};

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export const UserQuestionComponent = ({ type, ...rest }: UserQuestion) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers([
      {
        id: "user-1",
        firstname: "tesst",
        lastname: "tesst",
        email: "tesst@gmail.com",
      },
      {
        id: "user-2",
        firstname: "second",
        lastname: "teets",
        email: "tesst@gmail.com",
      },
    ]);
  }, []);

  return (
    <SelectQuestionComponent
      options={users.map((user) => ({
        value: user.id,
        name: `${user.firstname} ${user.lastname}`,
      }))}
      type="select"
      {...rest}
    />
  );
};

export const SelectQuestionComponent = ({
  name,
  label,
  placeholder,
  options,
}: SelectQuestion) => {
  return (
    <QuestionContainer>
      <Select>
        <Label htmlFor={name}>{label}</Label>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.length === 0 ? (
              <div>Pas de résultat</div>
            ) : (
              options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.name}
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </QuestionContainer>
  );
};

export const BooleanQuestionComponent = ({
  name,
  label,
  placeholder,
}: BooleanQuestion) => {
  return (
    <QuestionContainer>
      <Label htmlFor={name}>{label}</Label>
      <Checkbox id={name} placeholder={placeholder} />
    </QuestionContainer>
  );
};

export const QuestionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { display } = useForm();

  return (
    <div
      className={`flex gap-2 ${
        display === "row" ? "flex-row items-center" : "flex-col "
      } align-middle  `}
    >
      {children}
    </div>
  );
};

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormProviderProps {
  form: FormType;
  display: FormDisplay;
  children: React.ReactNode;
  defaultValues?: FormResponse;
  onSubmit: (formResponse: FormResponse) => Promise<void> | void;
}

type FormProviderState = {
  form: FormType;
  display: FormDisplay;
  onSubmit: (formResponse: FormResponse) => Promise<void> | void;
  submit: (e: React.FormEvent) => void;
  status: FormStatus;
  values: FormResponse;
} | null;

const FormProviderContext = createContext<FormProviderState>(null);

export function FormProvider({
  defaultValues,
  children,
  form,
  display,
  onSubmit,
}: FormProviderProps) {
  const [status, setStatus] = useState<FormStatus>("idle");

  const [formValues, setFormValues] = useState<FormResponse>(
    form.questions.reduce((acc, question) => {
      if (defaultValues && question.name in defaultValues) {
        acc[question.name] = defaultValues[question.name];
        return acc;
      }
      acc[question.name] = question.type === "boolean" ? false : "";
      return acc;
    }, {} as FormResponse)
  );

  console.log(formValues);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    await onSubmit(formValues);
    setStatus("idle");
  };

  return (
    <FormProviderContext.Provider
      value={{ form, display, onSubmit, submit, status, values: formValues }}
    >
      <div className="flex flex-col gap-4 p-4">{children}</div>
    </FormProviderContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormProviderContext);

  if (context == null) {
    throw new Error("useForm must be used within a FormProvider");
  }

  return context;
}

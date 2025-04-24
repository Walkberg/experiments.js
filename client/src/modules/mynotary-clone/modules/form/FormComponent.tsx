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
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { ScrollArea } from "@radix-ui/react-scroll-area";

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
  const methods = useForm<FormResponse>({
    defaultValues: form.questions.reduce((acc, q) => {
      acc[q.name] =
        defaultValues?.[q.name] ?? (q.type === "boolean" ? false : "");
      return acc;
    }, {} as FormResponse),
  });

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-4"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <ScrollArea>
          {form.questions.map((question) => (
            <QuestionComponent key={question.name} {...question} />
          ))}
        </ScrollArea>
        <Button disabled={status === "submitting"} type="submit">
          Envoyer
        </Button>
      </form>
    </FormProvider>
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
  required,
}: StringQuestion) => {
  const { register } = useFormContext();
  return (
    <QuestionContainer>
      <Label htmlFor={name}>{label}</Label>
      <Input
        type="text"
        id={name}
        placeholder={placeholder}
        {...register(name, { required: required })}
      />
    </QuestionContainer>
  );
};

export const NumberQuestionComponent = ({
  name,
  label,
  placeholder,
  required,
}: NumberQuestion) => {
  const { register } = useFormContext();
  return (
    <QuestionContainer>
      <Label htmlFor={name}>{label}</Label>
      <Input
        type="number"
        id={name}
        placeholder={placeholder}
        {...register(name, {
          required: required,
          valueAsNumber: true,
        })}
      />
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
  const { control } = useFormContext();

  return (
    <QuestionContainer>
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            className="w-full"
            onValueChange={field.onChange}
            value={field.value}
          >
            <SelectTrigger className="w-full">
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
        )}
      />
    </QuestionContainer>
  );
};

export const BooleanQuestionComponent = ({
  name,
  label,
  placeholder,
}: BooleanQuestion) => {
  const { control } = useFormContext();
  return (
    <QuestionContainer>
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Checkbox checked={field.value} id={name} placeholder={placeholder} />
        )}
      />
    </QuestionContainer>
  );
};

export const QuestionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [display, setDisplay] = useState("column");

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

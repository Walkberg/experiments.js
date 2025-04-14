import { Checkbox } from "@/components/ui/checkbox";
import { FormConfig, Question } from "../record";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ReactNode, createContext, useContext, useState } from "react";

interface RecordFormProps {
  config: FormConfig;
}

export const RecordForm = ({ config }: RecordFormProps) => {
  const handleResponseChange = () => {};

  const form = useForm({
    defaultValues: {
      username: "",
    },
  });

  return (
    <div>
      Record Form
      <LockableQuestion>
        <Form {...form}>
          {config.questions.map((question) => (
            <RecordFormQuestion
              question={question}
              onChange={handleResponseChange}
              disabled={false}
            />
          ))}
        </Form>
      </LockableQuestion>
    </div>
  );
};

interface FormQuestionProps {
  question: Question;
  disabled: boolean;
  onChange: (questionId: string, value: any) => void;
}

export const RecordFormQuestion = ({
  question,
  onChange,
}: FormQuestionProps) => {
  const { isLocked } = useLockQuestion(question.id);

  return (
    <div className="flex flex-row items-start gap-4">
      <QuestionLock questionId={question.id} />
      <QuestionAnswer
        question={question}
        onChange={onChange}
        disabled={isLocked}
      />
    </div>
  );
};

export const QuestionAnswer = ({ question, disabled }: FormQuestionProps) => {
  const form = useForm();
  return (
    <FormField
      control={form.control}
      render={({ field }) => (
        <FormItem className="flex flex-col flex-grow">
          <div className="flex flex-row justify-center items-center gap-4 w-full justify-between">
            <FormLabel>{question.name}</FormLabel>
            <Input
              disabled={disabled}
              className=""
              type="email"
              placeholder="Email"
            />
          </div>
          <FormDescription>{question.name}</FormDescription>
        </FormItem>
      )}
      name={""}
    />
  );
};

export interface QuestionLockProps {
  questionId: string;
}

export const QuestionLock = ({ questionId }: QuestionLockProps) => {
  const { isLocked, lockQuestion } = useLockQuestion(questionId);

  return (
    <div className="flex gap-4">
      <Checkbox checked={isLocked} onClick={() => lockQuestion(questionId)} />
    </div>
  );
};

function useLockQuestion(questionId: string): UseLockQuestion {
  const context = useContext(LockQuestionContext);

  if (context == null) {
    throw new Error();
  }

  const isLocked = context.questions.includes(questionId);

  return { isLocked, lockQuestion: context.lockQuestion };
}

interface UseLockQuestion {
  isLocked: boolean;
  lockQuestion: (questionId: string) => void;
}

interface LockableQuestionProps {
  children: ReactNode;
}

interface LockQuestion {
  questions: string[];
  lockQuestion: (questionId: string) => void;
}

const LockQuestionContext = createContext<LockQuestion | null>(null);

export const LockableQuestion = ({ children }: LockableQuestionProps) => {
  const [questions, setQuestions] = useState<string[]>([]);

  const lockQuestion = (questionId: string) => {
    setQuestions((prevQuestions) => {
      if (prevQuestions.includes(questionId)) {
        return prevQuestions.filter((id) => id !== questionId);
      } else {
        return [...prevQuestions, questionId];
      }
    });
  };

  return (
    <LockQuestionContext.Provider
      value={{ questions: questions, lockQuestion }}
    >
      {children}
    </LockQuestionContext.Provider>
  );
};

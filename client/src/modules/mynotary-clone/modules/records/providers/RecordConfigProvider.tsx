import { createContext, ReactNode, useContext, useState } from "react";
import { FormElement, FormType } from "../../form/form";
import { RecordConfig } from "../record-configs";

type RecordType = string;

interface RecordConfigContextValue {
  recordConfigs: RecordConfig[];
  setRecordConfigs: (configs: RecordConfig[]) => void;
  addRecordConfig: (newConfig: RecordConfig) => void;
  addQuestionToRecordConfig: (
    configId: RecordType,
    question: FormElement
  ) => void;
  removeQuestionFromRecordConfig: (
    configId: RecordType,
    questionId: string
  ) => void;
}

const RecordConfigContext = createContext<RecordConfigContextValue | null>(
  null
);

export const RecordConfigProvider = ({ children }: { children: ReactNode }) => {
  const [recordConfigs, setRecordConfigs] = useState<RecordConfig[]>([]);

  const value: RecordConfigContextValue = {
    recordConfigs,
    setRecordConfigs,
    addRecordConfig: (newConfig: RecordConfig) => {
      setRecordConfigs((prevConfigs) => [...prevConfigs, newConfig]);
    },
    addQuestionToRecordConfig: (
      configId: RecordType,
      question: FormElement
    ) => {
      setRecordConfigs((prevConfigs) =>
        prevConfigs.map((config) =>
          config.id === configId
            ? {
                ...config,
                form: {
                  ...config.form,
                  questions: [...(config.form?.questions ?? []), question],
                },
              }
            : config
        )
      );
    },
    removeQuestionFromRecordConfig: (
      configId: RecordType,
      questionId: string
    ) => {
      setRecordConfigs((prevConfigs) =>
        prevConfigs.map((config) =>
          config.id === configId
            ? {
                ...config,
                form: {
                  ...config.form,
                  questions: config.form.questions.filter(
                    (question) => question.name !== questionId
                  ),
                },
              }
            : config
        )
      );
    },
  };

  return (
    <RecordConfigContext.Provider value={value}>
      {children}
    </RecordConfigContext.Provider>
  );
};

export const useRecordConfigs = () => {
  const context = useContext(RecordConfigContext);
  if (!context) {
    throw new Error(
      "useRecordConfig must be used within a RecordConfigProvider"
    );
  }
  return context;
};

export const personnePhysiqueForm: FormType = {
  questions: [
    {
      type: "string",
      name: "lastname",
      label: "Nom",
      placeholder: "Nom",
      required: true,
    },
    {
      type: "string",
      name: "firstname",
      label: "Prénom",
      placeholder: "Prénom",
      required: true,
    },
    {
      type: "string",
      name: "email",
      label: "Email",
      placeholder: "Email",
      required: true,
    },
  ],
};

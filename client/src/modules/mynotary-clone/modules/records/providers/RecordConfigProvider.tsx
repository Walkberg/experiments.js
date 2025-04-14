import { createContext, ReactNode, useContext, useState } from "react";
import { FormType } from "../../form/form";

type RecordType = string;

interface RecordConfigContextValue {
  currentType: RecordType;
  currentConfig: RecordConfig;
  setRecordType: (type: RecordType) => void;
  recordConfigs: Record<string, RecordConfig>;
}

const RecordConfigContext = createContext<RecordConfigContextValue | null>(
  null
);

export const RecordConfigProvider = ({ children }: { children: ReactNode }) => {
  const [recordType, setRecordType] = useState<RecordType>("personne_physique");
  const [recordConfigs, setRecordConfigs] =
    useState<Record<string, RecordConfig>>(recordConfigsInitial);

  const value: RecordConfigContextValue = {
    currentType: recordType,
    currentConfig: recordConfigs[recordType],
    setRecordType,
    recordConfigs,
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

const personnePhysiqueForm: FormType = {
  questions: [
    {
      type: "string",
      name: "name",
      label: "Nom",
      placeholder: "Nom",
      required: true,
    },
    {
      type: "number",
      name: "age",
      label: "Age",
      placeholder: "Age",
      required: true,
    },
    {
      type: "boolean",
      name: "isCool",
      label: "Est cool",
      placeholder: "Est cool",
      required: true,
    },
    {
      type: "select",
      name: "fjkdfok",
      label: "select",
      placeholder: "select",
      options: [
        { name: "test", value: "test" },
        { name: "aaaa", value: "aaa" },
        { name: "bbb", value: "bbb" },
        { name: "cxcc", value: "cccc" },
      ],
      required: false,
    },
    {
      type: "user",
      name: "topUser",
      label: "Attribué à:",
      placeholder: "Est cool",
      required: false,
    },
  ],
};

const personneMoralForm: FormType = {
  questions: [
    {
      type: "string",
      name: "siren",
      label: "Siren",
      placeholder: "Siren",
      required: true,
    },
  ],
};

const bienForm: FormType = {
  questions: [
    {
      type: "string",
      name: "address",
      label: "Address",
      placeholder: "Address",
      required: true,
    },
  ],
};

type RecordConfigId = string;

type RecordConfigType = "person" | "property";

type RecordConfig = {
  id: RecordConfigId;
  type: RecordConfigType;
  form: FormType;
};

const recordConfigsInitial: Record<string, RecordConfig> = {
  personne_physique: {
    id: "personne_physique",
    type: "person",
    form: personnePhysiqueForm,
  },
  personne_moral: {
    id: "personne_moral",
    type: "person",
    form: personneMoralForm,
  },
  bien: {
    id: "bien",
    type: "property",
    form: bienForm,
  },
};

import { createContext, ReactNode, useContext, useState } from "react";
import { FormType } from "../../form/form";
import { RecordConfig, RecordFormConfig } from "../record-configs";

type RecordType = string;

interface RecordConfigContextValue {
  recordConfigs: RecordConfig[];
  setRecordConfigs: (configs: RecordConfig[]) => void;
  addRecordConfig: (newConfig: RecordConfig) => void;
}

const RecordConfigContext = createContext<RecordConfigContextValue | null>(
  null
);

export const RecordConfigProvider = ({ children }: { children: ReactNode }) => {
  const [recordConfigs, setRecordConfigs] =
    useState<RecordConfig[]>(recordConfigsInitial);

  const value: RecordConfigContextValue = {
    recordConfigs,
    setRecordConfigs,
    addRecordConfig: (newConfig: RecordConfig) => {
      setRecordConfigs((prevConfigs) => [...prevConfigs, newConfig]);
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

const personneMoralForm: RecordFormConfig = {
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

const bienForm: RecordFormConfig = {
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

const recordConfigsInitial: RecordConfig[] = [
  {
    id: "personne_physique",
    label: "Personne physique",
    type: "person",
    form: personnePhysiqueForm,
  },
  {
    id: "personne_moral",
    label: "Personne morale",
    type: "person",
    form: personneMoralForm,
  },
  {
    id: "bien",
    label: "Bien",
    type: "property",
    form: bienForm,
  },
];

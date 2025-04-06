import { createContext, useContext, useState } from "react";

export type OperationType = {
  id: string;
  type: string;
};

interface OperationTypesContextType {
  operationTypes: OperationType[];
}

const defaultOperationTypes: OperationType[] = [
  { id: "1", type: "vente ancien" },
  { id: "2", type: "viager" },
];

const OperationTypesContext = createContext<OperationTypesContextType | null>(
  null
);

export const OperationTypesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [operationTypes, setOperationTypes] = useState<OperationType[]>(
    defaultOperationTypes
  );
  return (
    <OperationTypesContext.Provider value={{ operationTypes }}>
      {children}
    </OperationTypesContext.Provider>
  );
};

export const useOperationTypes = (): OperationTypesContextType => {
  const context = useContext(OperationTypesContext);
  if (!context) {
    throw new Error(
      "useOperationTypes must be used within OperationTypesProvider"
    );
  }
  return context;
};

import { ReactNode, createContext, useContext, useState } from "react";
import { OperationClient } from "../operation";
import { FakeOperationClient } from "../in-memory-operation.client";

interface OperationContextState {
  operationClient: OperationClient;
}

const OperationClientContext = createContext<OperationContextState | null>(
  null
);

interface OperationClientProviderProps {
  children: ReactNode;
}

export const OperationClientProvider = ({
  children,
}: OperationClientProviderProps) => {
  const [operationClient, setOperationClient] = useState<OperationClient>(
    new FakeOperationClient()
  );

  return (
    <OperationClientContext.Provider value={{ operationClient }}>
      {children}
    </OperationClientContext.Provider>
  );
};

// Hook pour utiliser le operationClient dans les composants enfants
export function useOperationClient() {
  const context = useContext(OperationClientContext);

  if (context == null) {
    throw new Error(
      "useoperationClient doit être utilisé dans un composant enfant de operationClientProvider"
    );
  }

  return context.operationClient;
}

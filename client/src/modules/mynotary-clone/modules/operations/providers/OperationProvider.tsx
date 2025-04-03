import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Operation } from "../operation"; // Importez correctement vos types
import { useOperationClient } from "./OperationClientProvider"; // Importez votre hook pour accéder au client d'opérations

type OperationStatus = "fetching" | "init" | "succeed" | "error";

interface OperationContextState {
  status: OperationStatus;
  operation?: Operation;
}

const OperationContext = createContext<OperationContextState | null>(null);

interface OperationProviderProps {
  children: ReactNode;
  operationId: string;
}

export const OperationProvider = ({
  children,
  operationId,
}: OperationProviderProps) => {
  const [status, setStatus] = useState<OperationStatus>("init");
  const [operation, setOperation] = useState<Operation>();

  const client = useOperationClient();

  useEffect(() => {
    const fetchOperation = async () => {
      try {
        setStatus("fetching");
        const fetchedOperation = await client.getOperation(operationId);
        setOperation(fetchedOperation);
        setStatus("succeed");
      } catch (error) {
        setStatus("error");
      }
    };

    fetchOperation();
  }, [client, operationId]);

  return (
    <OperationContext.Provider value={{ operation, status }}>
      {children}
    </OperationContext.Provider>
  );
};

export function useOperation() {
  const context = useContext(OperationContext);

  if (context == null) {
    throw new Error(
      "useOperation doit être utilisé dans un composant enfant de OperationProvider"
    );
  }

  return context;
}

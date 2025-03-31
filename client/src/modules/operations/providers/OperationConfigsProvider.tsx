import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { OperationConfigsClient } from "../operation"; // Importez correctement vos types
import { OperationConfig } from "@/modules/redaction/redaction";
import { FakeOperationConfigClient } from "../in-memory-operation-configs.client";

type OperationStatus = "fetching" | "init" | "succeed" | "error";

interface OperationContextState {
  status: OperationStatus;
  operationConfigs?: OperationConfig[];
  getOperationConfigs: (type: string) => OperationConfig | undefined;
}

const OperationConfigsContext = createContext<OperationContextState | null>(
  null
);

interface OperationProviderProps {
  children: ReactNode;
}

export const OperationConfigsProvider = ({
  children,
}: OperationProviderProps) => {
  const [status, setStatus] = useState<OperationStatus>("init");
  const [operationConfigs, setOperationConfigs] = useState<OperationConfig[]>(
    []
  );
  const [client, setClient] = useState<OperationConfigsClient>(
    new FakeOperationConfigClient()
  );

  useEffect(() => {
    const fetchOperationConfigs = async () => {
      if (!client) {
        return;
      }
      try {
        setStatus("fetching");
        const fetchedOperation = await client.getOperationConfigs();
        setOperationConfigs(fetchedOperation);
        setStatus("succeed");
      } catch (error) {
        setStatus("error");
      }
    };

    fetchOperationConfigs();
  }, [client]);

  function getOperationConfigs(type: string) {
    return operationConfigs.find((config) => config.type === type);
  }

  return (
    <OperationConfigsContext.Provider
      value={{ operationConfigs, status, getOperationConfigs }}
    >
      {children}
    </OperationConfigsContext.Provider>
  );
};

export function useOperationConfigs() {
  const context = useContext(OperationConfigsContext);

  if (context == null) {
    throw new Error(
      "useOperation doit être utilisé dans un composant enfant de OperationProvider"
    );
  }

  return context;
}

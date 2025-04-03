import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ContractConfig } from "@/modules/redaction/redaction";
import { useOperationConfigClient } from "../components/OPerationConfigManager";

type OperationStatus = "fetching" | "init" | "succeed" | "error";

interface OperationContextState {
  status: OperationStatus;
  operationConfigs?: ContractConfig[];
  getOperationConfigs: (type: string) => ContractConfig | undefined;
  getContractsConfigs: () => ContractConfig[];
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
  const [operationConfigs, setOperationConfigs] = useState<ContractConfig[]>(
    []
  );
  const client = useOperationConfigClient();

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

  function getContractsConfigs() {
    return operationConfigs;
  }

  return (
    <OperationConfigsContext.Provider
      value={{
        operationConfigs,
        status,
        getOperationConfigs,
        getContractsConfigs,
      }}
    >
      {children}
    </OperationConfigsContext.Provider>
  );
};

export function useContractsConfigs() {
  const context = useContext(OperationConfigsContext);

  if (context == null) {
    throw new Error(
      "useOperation doit être utilisé dans un composant enfant de OperationProvider"
    );
  }

  return context;
}

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  fakeConfig,
  fakeOperationLinks,
  ContractConfig,
  OperationLink,
} from "../redaction";
import { useContractsConfigs } from "@/modules/operations/providers/OperationConfigsProvider";

type RedactionStatus = "fetching" | "init" | "succeed" | "error";

interface RedactionContextState {
  status: RedactionStatus;
  redaction?: ContractConfig;
  operationLinks: OperationLink[];
}

const RedactionContext = createContext<RedactionContextState | null>(null);

interface RedactionProviderProps {
  children: ReactNode;
  templateId: string;
}

export const RedactionProvider = ({
  children,
  templateId,
}: RedactionProviderProps) => {
  const [status, setStatus] = useState<RedactionStatus>("init");
  const [redaction, setRedaction] = useState<ContractConfig>();
  const [operationLinks, setOperationLinks] = useState<OperationLink[]>([]);

  const { getOperationConfigs } = useContractsConfigs();

  useEffect(() => {
    const fetchRedaction = async () => {
      try {
        setStatus("fetching");
        setRedaction(getOperationConfigs(templateId));
        setOperationLinks(fakeOperationLinks);
        setStatus("succeed");
      } catch (error) {
        setStatus("error");
      }
    };

    fetchRedaction();
  }, [templateId]);

  return (
    <RedactionContext.Provider value={{ redaction, status, operationLinks }}>
      {children}
    </RedactionContext.Provider>
  );
};

export function useRedaction() {
  const context = useContext(RedactionContext);

  if (context == null) {
    throw new Error(
      "useRedaction doit être utilisé dans un composant enfant de RedactionProvider"
    );
  }

  return context;
}

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  fakeOperationLinks,
  fakeRedaction,
  OperationConfig,
  OperationLink,
} from "../redaction";
import { set } from "react-hook-form";

type RedactionStatus = "fetching" | "init" | "succeed" | "error";

interface RedactionContextState {
  status: RedactionStatus;
  redaction?: OperationConfig;
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
  const [redaction, setRedaction] = useState<OperationConfig>();
  const [operationLinks, setOperationLinks] = useState<OperationLink[]>([]);

  useEffect(() => {
    const fetchRedaction = async () => {
      try {
        setStatus("fetching");
        setRedaction(fakeRedaction);
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

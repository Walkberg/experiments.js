import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Contract, ContractFiltering, ContractNew } from "../contract"; // Importez correctement vos types
import { useContractClient } from "./ContractClientProvider"; // Importez votre hook pour accéder au client de contrats

type ContractStatus = "fetching" | "init" | "succeed" | "error";

interface ContractContextState {
  createContract: (contractNew: ContractNew) => Promise<void>;
  status: ContractStatus;
  contracts: Contract[];
}

const ContractContext = createContext<ContractContextState | null>(null);

interface ContractProviderProps {
  children: ReactNode;
  operationId: string; // ID de l'opération liée aux contrats à récupérer
}

export const ContractProvider = ({
  children,
  operationId,
}: ContractProviderProps) => {
  const [status, setStatus] = useState<ContractStatus>("init");
  const [contracts, setContracts] = useState<Contract[]>([]);

  const client = useContractClient(); // Utilisation du hook pour obtenir le client de contrats

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setStatus("fetching");
        const filtering: ContractFiltering = { operationId };
        const fetchedContracts = await client.getContracts(filtering);
        setContracts(fetchedContracts);
        setStatus("succeed");
      } catch (error) {
        setStatus("error");
      }
    };

    fetchContracts();
  }, [client, operationId]);

  const createContract = async (contractNew: ContractNew) => {
    try {
      const contractCreated = await client.createContract(contractNew);

      setContracts((prev) => [
        ...prev,
        { id: contractCreated.id, ...contractNew },
      ]);
    } catch (error) {
      console.error("Erreur lors de la création du contrat :", error);
      throw error;
    }
  };

  return (
    <ContractContext.Provider value={{ contracts, status, createContract }}>
      {children}
    </ContractContext.Provider>
  );
};

export function useContracts() {
  const context = useContext(ContractContext);

  if (context == null) {
    throw new Error(
      "useContracts doit être utilisé dans un composant enfant de ContractProvider"
    );
  }

  return context;
}

export function useCreateContract() {
  const context = useContext(ContractContext);

  if (context == null) {
    throw new Error(
      "useContracts doit être utilisé dans un composant enfant de ContractProvider"
    );
  }

  return context.createContract;
}

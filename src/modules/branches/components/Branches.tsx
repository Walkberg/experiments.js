import { ReactNode, createContext, useEffect, useState } from "react";
import { useBranches } from "../useBranches";
import { Branch } from "./Branch";
import { Branch as BranchType, createBranch } from "../branch";
import { BranchApiImpl } from "../branch.api";

interface BranchesProps {
  operationId: string;
}

export const Branches = ({}: BranchesProps) => {
  const { branches, status } = useBranches("operation-1");

  if (status === "loading") {
    return <div>... loading</div>;
  }

  if (status === "error") {
    return <div>Une erreur est survenue</div>;
  }

  return (
    <div className="flex flex-col items-center">
      {branches.map((branch) => (
        <BranchProvider key={branch.id} branchId={branch.id}>
          <Branch />
        </BranchProvider>
      ))}
    </div>
  );
};

type BranchStatus = "pending" | "loading" | "success" | "error";

interface BranchResponse {
  branch: BranchType | null;
  status: BranchStatus;
  addRecord: (recordId: string) => Promise<void>;
  removeRecord: (recordId: string) => Promise<void>;
}

export const BranchContext = createContext<BranchResponse | null>(null);

interface BranchProviderProps {
  branchId: string;
  children: ReactNode;
}

const branchApi = new BranchApiImpl();

export const BranchProvider = ({ branchId, children }: BranchProviderProps) => {
  const [branch, setBranch] = useState<BranchType | null>(null);
  const [status, setStatus] = useState<BranchStatus>("pending");

  useEffect(() => {
    setBranch(createBranch());
    // fetch branches
  }, []);

  const addRecord = async (recordId: string) => {
    try {
      setStatus("loading");
      await branchApi.createBranchRecord({ branchId, recordId });
      setStatus("success");
    } catch (e) {
      setStatus("error");
      // handle eeror
    }
    setBranch((prev) => {
      if (prev === null) {
        return null;
      }
      return { ...prev, recordIds: [...prev.recordIds, recordId] };
    });
  };

  const removeRecord = async (recordId: string) => {
    setBranch((prev) => {
      if (prev === null) {
        return null;
      }
      return {
        ...prev,
        recordIds: prev.recordIds.filter(
          (prevRecordId) => prevRecordId === recordId
        ),
      };
    });
  };

  return (
    <BranchContext.Provider value={{ addRecord, removeRecord, branch, status }}>
      {children}
    </BranchContext.Provider>
  );
};

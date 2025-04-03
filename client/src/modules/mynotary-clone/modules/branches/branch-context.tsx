import { ReactNode, createContext, useEffect, useState } from "react";
import { BranchApiImpl } from "./branch.api";
import { Branch, createBranch } from "./branch";

type BranchStatus = "pending" | "loading" | "success" | "error";

interface BranchResponse {
  branch: Branch | null;
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
  const [branch, setBranch] = useState<Branch | null>(null);
  const [status, setStatus] = useState<BranchStatus>("pending");

  useEffect(() => {
    try {
      setBranch(createBranch());
    } catch (e) {
      setStatus("error");
    }
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

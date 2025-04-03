import { ReactNode, createContext, useEffect, useState } from "react";
import { BranchApiImpl } from "./branch.api";
import { Branch, ShortBranch, vendeurConfig } from "./branch";

type BranchStatus = "pending" | "loading" | "success" | "error";

interface BranchesResponse {
  branches: Branch[];
  status: BranchStatus;
}

export const BranchesContext = createContext<BranchesResponse | null>(null);

interface BranchesProviderProps {
  operationId: string;
  children: ReactNode;
}

const branchApi = new BranchApiImpl();

export const BranchesProvider = ({
  operationId,
  children,
}: BranchesProviderProps) => {
  const [branches, setBranches] = useState<ShortBranch[]>([]);
  const [status, setStatus] = useState<BranchStatus>("pending");

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setStatus("loading");
        const branches = await branchApi.getBranches({ operationId });
        setBranches(branches);
        setStatus("success");
      } catch (e) {
        setStatus("error");
      }
    };

    fetchBranches();
  }, []);

  return (
    <BranchesContext.Provider
      value={{
        branches: branches.map((branch) => ({
          ...branch,
          config: vendeurConfig,
        })),
        status,
      }}
    >
      {children}
    </BranchesContext.Provider>
  );
};

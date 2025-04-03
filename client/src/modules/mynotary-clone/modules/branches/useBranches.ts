import { useContext } from "react";
import { Branch } from "./branch";
import { BranchesContext } from "./branches-context";

interface UseBranches {
  status: string;
  branches: Branch[];
}

export function useBranches(operationId: string): UseBranches {
  const context = useContext(BranchesContext);
  if (context === null) {
    throw new Error();
  }

  return { branches: context.branches, status: context.status };
}

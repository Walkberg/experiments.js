import { useContext } from "react";
import { Branch, createBranch } from "./branch";
import { BranchContext } from "./components/Branches";

interface UseBranch {
  status: string;
  branch: Branch | null;
  addRecord: (recordId: string) => Promise<void>;
  removeRecord: (recordId: string) => Promise<void>;
}

export function useBranch(): UseBranch {
  const branchBontext = useContext(BranchContext);

  if (branchBontext === null) {
    throw new Error();
  }

  return {
    branch: branchBontext.branch,
    status: branchBontext.status,
    addRecord: branchBontext.addRecord,
    removeRecord: branchBontext.removeRecord,
  };
}

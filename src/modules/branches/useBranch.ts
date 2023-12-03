import { Branch, createBranch } from "./branch";

interface UseBranch {
  status: string;
  branch: Branch;
}

export function useBranch(branchId:string): UseBranch {
  return { branch: createBranch(), status: "pending" };
}

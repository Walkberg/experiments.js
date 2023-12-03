import { useEffect, useState } from "react";
import { Branch } from "./branch";
import { BranchApiImpl } from "./branch.api";

interface UseBranches {
  status: string;
  branches: Branch[];
}

type Status = "pending" | "error" | "success" | "loading";

const branchApi = new BranchApiImpl();

export function useBranches(operationId: string): UseBranches {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [status, setStatus] = useState<Status>("pending");

  useEffect(() => {
    const fetchBranches = async () => {
      setStatus("loading");
      const branches = await branchApi.getBranches({
        operationId: operationId,
      });

      const branchess: Branch[] = branches.map((branch) => ({
        ...branch,
        config: {
          acceptedTemplateIds: [],
          creation: { maxRecordCount: 3 },
          type: "vendeur",
          id: "test",
        },
      }));
      setStatus("success");
      setBranches(branchess);
    };
    fetchBranches();
  }, [operationId]);

  return { branches: branches, status: status };
}

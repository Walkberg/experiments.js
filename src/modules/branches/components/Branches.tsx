import { useBranches } from "../useBranches";
import { Branch } from "./Branch";

interface BranchesProps {
  operationId: string;
}

export const Branches = ({}: BranchesProps) => {
  const { branches, status } = useBranches('operation-1');

  if (status === "loading") {
    return <div>... loading</div>;
  }

  if (status === "error") {
    return <div>Une erreur est survenue</div>;
  }

  return (
    <div className="flex flex-col items-center">
      {branches.map((branch) => (
        <Branch key={branch.id} branchId={branch.id} />
      ))}
    </div>
  );
};

import { useBranches } from "../useBranches";
import { Branch } from "./Branch";
import { BranchProvider } from "../branch-context";
import { Skeleton } from "@/components/ui/skeleton";

interface BranchesProps {}

export const Branches = ({}: BranchesProps) => {
  const { branches, status } = useBranches("operation-1");

  if (status === "loading") {
    return <BranchesPlaceHolder />;
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

export const BranchesPlaceHolder = () => {
  return (
    <div className="flex flex-col gap-4 justify-center">
      <Skeleton className="h-12 w-[300px] bg-slate-200" />
      <Skeleton className="h-12 w-[300px] bg-slate-200" />
      <Skeleton className="h-12 w-[300px] bg-slate-200" />
      <Skeleton className="h-12 w-[300px] bg-slate-200" />
    </div>
  );
};

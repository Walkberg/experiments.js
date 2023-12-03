import { useBranch } from "../useBranch";
import { Record } from "@/modules/records/components/Record";
import { BranchRecordAdd } from "./BranchRecordAdd";
import { RecordActions } from "@/modules/records/components/RecordActions";

interface BranchProps {
  branchId: string;
}

export const Branch = ({ branchId }: BranchProps) => {
  const { branch, status } = useBranch(branchId);

  if (status === "loading") {
    return <div>... loading</div>;
  }

  if (status === "error") {
    return <div>Une erreur est survenue</div>;
  }

  return (
    <div className="flex flex-col gap-2 w-full p-4">
      <div className="flex justify-between items-center">
        {branch.name}
        <BranchRecordAdd branchId={branch.id} />
      </div>
      <div className="flex flex-col gap-2">
        {branch.recordIds.map((recordId) => (
          <Record key={recordId} recordId={recordId} actions={<RecordActions recordId={recordId}/>} />
        ))}
        {branch.recordIds.length === 0 && (
          <div>
            <div>PAs de record pour le momeent</div>
            <BranchRecordAdd branchId={branch.id} />
          </div>
        )}
      </div>
    </div>
  );
};

import { useBranch } from "../useBranch";
import { Record } from "@/modules/mynotary-clone/modules/records/components/Record";
import { BranchRecordAdd } from "./BranchRecordAdd";
import { RecordActions } from "@/modules/mynotary-clone/modules/records/components/RecordActions";
import { RecordProvider } from "@/modules/mynotary-clone/modules/records/record-context";

export const Branch = () => {
  const { branch, status } = useBranch();

  if (status === "loading" || branch === null) {
    return <div>... loading</div>;
  }

  if (status === "error") {
    return <div>Une erreur est survenue</div>;
  }

  return (
    <div className="flex flex-col gap-2 w-full p-4">
      <div className="flex justify-between items-center">
        {branch.name}
        <BranchRecordAdd />
      </div>
      <div className="flex flex-col gap-2">
        {branch.recordIds.map((recordId) => (
          <RecordProvider key={recordId} recordId={recordId}>
            <Record actions={<RecordActions recordId={recordId} />} />
          </RecordProvider>
        ))}
        {branch.recordIds.length === 0 && (
          <div>
            <div>PAs de record pour le momeent</div>
            <BranchRecordAdd />
          </div>
        )}
      </div>
    </div>
  );
};

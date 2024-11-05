import { BranchRecordAdd } from "@/modules/branches/components/BranchRecordAdd";
import { LinkConfig } from "../redaction";
import { Button } from "@/components/ui/button";
import { useRedaction } from "../providers/RedactionProvider";
import { RecordTile } from "@/modules/records/components/RecordTile";
import { RecordProvider } from "@/modules/records/record-context";
import { Record } from "@/modules/records/components/Record";
import { RecordActions } from "@/modules/records/components/RecordActions";

interface OperationLinkConfigProps {
  operationLinkConfig: LinkConfig;
}

export const OperationLinkConfig = ({
  operationLinkConfig,
}: OperationLinkConfigProps) => {
  const { operationLinks } = useRedaction();

  const targetOperationLinks = operationLinks.filter(
    (operationLink) => operationLink.type === operationLinkConfig.type
  );
  return (
    <div className="flex flex-col gap-2 w-full p-4">
      <div className="flex justify-between items-center">
        <div>{operationLinkConfig.type}</div>
        <AddBranch />
      </div>
      <div className="flex flex-col gap-2">
        {targetOperationLinks.length === 0 ? (
          <div>
            <div>PAs de record pour le momeent</div>
            <AddBranch />
          </div>
        ) : (
          targetOperationLinks.map((operationLink) => (
            <RecordProvider
              key={operationLink.recordId}
              recordId={operationLink.recordId}
            >
              <Record />
            </RecordProvider>
          ))
        )}
      </div>
    </div>
  );
};

const AddBranch = () => {
  return <Button>Ajouter</Button>;
};

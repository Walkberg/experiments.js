import { LinkConfig } from "../redaction";
import { Button } from "@/components/ui/button";
import { useRedaction } from "../providers/RedactionProvider";
import { RecordProvider } from "@/modules/mynotary-clone/modules/records/record-context";
import { Record } from "@/modules/mynotary-clone/modules/records/components/Record";

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
        <AddBranch onClick={() => {}} config={operationLinkConfig} />
      </div>
      <div className="flex flex-col gap-2">
        {targetOperationLinks.length === 0 ? (
          <div>
            <div>PAs de record pour le momeent</div>
            <AddBranch onClick={() => {}} config={operationLinkConfig} />
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

interface AddBranchProps {
  config: LinkConfig;
  onClick: () => void;
}

const AddBranch = ({ onClick, config }: AddBranchProps) => {
  if (config.creation.isAutoCreate ?? false) {
    return null;
  }
  return <Button onClick={onClick}>Ajouter</Button>;
};

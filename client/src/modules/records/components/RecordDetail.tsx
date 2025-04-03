import { LinkProvider } from "@/modules/mynotary-clone/modules/links/links-context";
import { personnePhysiqueConfig } from "../record";
import { RecordForm } from "./RecordForm";
import { RecordLink } from "./RecordLink";

interface RecordDetailProps {
  recordId: string;
}

export const RecordDetail = ({ recordId }: RecordDetailProps) => {
  return (
    <div>
      <RecordForm config={personnePhysiqueConfig.form} />
      <LinkProvider recordId={recordId}>
        <RecordLink />
      </LinkProvider>
    </div>
  );
};

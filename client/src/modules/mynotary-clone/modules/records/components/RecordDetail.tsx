import { LinkProvider } from "@/modules/mynotary-clone/modules/links/links-context";

import { RecordForm } from "./RecordForm";
import { RecordLink } from "./RecordLink";
import { personnePhysiqueForm } from "../providers/RecordConfigProvider";

interface RecordDetailProps {
  recordId: string;
}

export const RecordDetail = ({ recordId }: RecordDetailProps) => {
  return (
    <div>
      <RecordForm config={personnePhysiqueForm} />
      <LinkProvider recordId={recordId}>
        <RecordLink />
      </LinkProvider>
    </div>
  );
};

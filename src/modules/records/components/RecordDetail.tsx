import { personnePhysiqueConfig } from "../record";
import { RecordForm } from "./RecordForm";

interface RecordDetailProps {
  recordId: string;
}

export const RecordDetail = ({ recordId }: RecordDetailProps) => {
  return (
    <div>
      RecordDetail {recordId}
      <RecordForm config={personnePhysiqueConfig.form} />
    </div>
  );
};

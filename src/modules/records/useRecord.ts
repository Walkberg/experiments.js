import { useContext } from "react";
import { RecordContext, RecordStatus } from "./components/Record";
import { Recorde } from "./record";

interface UseRecord {
  status: RecordStatus;
  record: Recorde | null;
}

export const useRecord = (): UseRecord => {
  const context = useContext(RecordContext);

  if (context == null) {
    throw new Error();
  }

  return { record: context.record, status: context.status };
};

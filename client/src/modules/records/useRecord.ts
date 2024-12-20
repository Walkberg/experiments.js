import { useContext } from "react";
import { RecordLink, Recorde } from "./record";
import { RecordContext, RecordStatus } from "./record-context";

interface UseRecord {
  status: RecordStatus;
  record: Recorde | null;
}

export const useRecord = (): UseRecord => {
  const context = useContext(RecordContext);

  if (context == null) {
    throw new Error();
  }

  return {
    record: context.record,
    status: context.status,
  };
};

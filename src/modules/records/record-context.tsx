import { ReactNode, createContext, useEffect, useState } from "react";
import { RecordApiImpl } from "./record.api";
import { RecordLink, Recorde } from "./record";

const recordApi = new RecordApiImpl();

export type RecordStatus = "pending" | "loading" | "success" | "error";

interface RecordResponse {
  record: Recorde | null;
  status: RecordStatus;
}

export const RecordContext = createContext<RecordResponse | null>(null);

interface BranchProviderProps {
  recordId: string;
  children: ReactNode;
}

export const RecordProvider = ({ recordId, children }: BranchProviderProps) => {
  const [record, setRecord] = useState<Recorde | null>(null);
  const [status, setStatus] = useState<RecordStatus>("pending");

  useEffect(() => {
    const fetchRecord = async () => {
      setStatus("loading");
      try {
        const record = await recordApi.getRecord(recordId);
        setRecord(record);
        setStatus("success");
      } catch (e) {
        setStatus("error");
      }
    };

    fetchRecord();
  }, []);

  return (
    <RecordContext.Provider value={{ record: record, status }}>
      {children}
    </RecordContext.Provider>
  );
};

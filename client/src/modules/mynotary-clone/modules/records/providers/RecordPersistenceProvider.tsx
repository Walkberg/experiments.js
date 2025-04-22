import { createContext, useContext, useState, ReactNode } from "react";
import { Recorde } from "../record";

interface RecordContextState {
  records: Recorde[];
  setRecords: (records: Recorde[]) => void;
  addRecord: (record: Recorde) => void;
  removeRecord: (recordId: string) => void;
}

const RecordContext = createContext<RecordContextState | null>(null);

interface RecordProviderProps {
  children: ReactNode;
}

export function RecordProvider({ children }: RecordProviderProps) {
  const [records, setRecords] = useState<Recorde[]>([]);

  const addRecord = (record: Recorde) => {
    setRecords((prev) => [...prev, record]);
  };

  const removeRecord = (recordId: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== recordId));
  };

  return (
    <RecordContext.Provider
      value={{ records, setRecords, addRecord, removeRecord }}
    >
      {children}
    </RecordContext.Provider>
  );
}

export function useRecords() {
  const context = useContext(RecordContext);
  if (!context) {
    throw new Error("useRecords must be used within RecordProvider");
  }
  return context;
}

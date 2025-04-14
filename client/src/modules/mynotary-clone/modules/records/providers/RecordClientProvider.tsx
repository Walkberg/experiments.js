import { createContext, useContext } from "react";
import { RecordApi } from "../record";
import { DbRecordClient } from "../db-record.client";

const RecordClientContext = createContext<RecordApi | null>(null);

interface RecordClientProviderProps {
  children: React.ReactNode;
}

export function RecordClientProvider({ children }: RecordClientProviderProps) {
  const client = new DbRecordClient();

  return (
    <RecordClientContext.Provider value={client}>
      {children}
    </RecordClientContext.Provider>
  );
}

export function useRecordClient(): RecordApi {
  const context = useContext(RecordClientContext);
  if (!context) {
    throw new Error(
      "useRecordClient must be used within a RecordClientProvider"
    );
  }
  return context;
}

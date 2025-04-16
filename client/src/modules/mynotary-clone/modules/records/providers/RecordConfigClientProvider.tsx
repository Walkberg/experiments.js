import { createContext, useContext } from "react";
import { RecordConfigClient } from "../record-configs";
import { DbRecordConfigClient } from "../db-record-config.client";

const RecordConfigClientContext = createContext<RecordConfigClient | null>(
  null
);

interface RecordConfigClientProviderProps {
  children: React.ReactNode;
}

export function RecordConfigClientProvider({
  children,
}: RecordConfigClientProviderProps) {
  const client = new DbRecordConfigClient();

  return (
    <RecordConfigClientContext.Provider value={client}>
      {children}
    </RecordConfigClientContext.Provider>
  );
}

export function useRecordConfigClient(): RecordConfigClient {
  const context = useContext(RecordConfigClientContext);
  if (!context) {
    throw new Error(
      "useRecordConfigClient must be used within a RecordConfigClientProvider"
    );
  }
  return context;
}

import { ReactNode, createContext, useContext, useState } from "react";
import { DriveClient } from "../drive";
import { InMemoryDriveClient } from "../in-memory-drive.client ";

interface DriveSearchContextType {
  client: DriveClient;
}

const DriveClientContext = createContext<DriveSearchContextType | null>(null);

interface DriveProviderProps {
  children: ReactNode;
}

export const DriveClientProvider = ({ children }: DriveProviderProps) => {
  const [client, setClient] = useState(new InMemoryDriveClient());

  return (
    <DriveClientContext.Provider value={{ client }}>
      {children}
    </DriveClientContext.Provider>
  );
};

export function useDriveClient() {
  const context = useContext(DriveClientContext);

  if (context == null) {
    throw new Error();
  }

  return context.client;
}

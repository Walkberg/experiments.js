import { ReactNode, createContext, useContext } from "react";
import { DriveSearchProvider } from "./DriveSearchProvider";
import { DocumentsSelectionProvider } from "./DocumentSelectionProvider";
import { DriveFolderProvider } from "./DriveFolderProvider";
import { DriveDocumentProvider } from "./DriveDocumentProvider";

interface DriveContextType {
  id: string;
}

const DriveContext = createContext<DriveContextType | null>(null);

interface DriveProviderProps {
  driveId: string;
  children: ReactNode;
}

export const DriveProvider = ({ children, driveId }: DriveProviderProps) => {
  return (
    <DriveContext.Provider
      value={{
        id: driveId,
      }}
    >
      <DriveFolderProvider driveId={driveId}>
        <DriveDocumentProvider driveId={driveId}>
          <DriveSearchProvider>
            <DocumentsSelectionProvider>{children}</DocumentsSelectionProvider>
          </DriveSearchProvider>
        </DriveDocumentProvider>
      </DriveFolderProvider>
    </DriveContext.Provider>
  );
};

export function useDrive() {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.id;
}

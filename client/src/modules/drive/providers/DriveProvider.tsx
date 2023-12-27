import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DriveDocument,
  DriveDocumentMove,
  DriveFolder,
  DriveFolderNew,
  DriveFolderUpdate,
} from "../drive";
import { DriveSearchProvider } from "./DriveSearchProvider";
import { DocumentsSelectionProvider } from "./DocumentSelectionProvider";
import { useDriveClient } from "./DriveClientProvider";

interface DriveContextType {
  id: string;
  documents: DriveDocument[];
  folders: DriveFolder[];
  addFolder: (newFolder: DriveFolderNew) => Promise<void>;
  updateFolder: (folderUpdate: DriveFolderUpdate) => Promise<void>;
  moveDocument: (documentMove: DriveDocumentMove) => Promise<void>;
}

const DriveContext = createContext<DriveContextType | null>(null);

interface DriveProviderProps {
  driveId: string;
  children: ReactNode;
}

export const DriveProvider = ({ children, driveId }: DriveProviderProps) => {
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [documents, setDocuments] = useState<DriveDocument[]>([]);

  const client = useDriveClient();

  useEffect(() => {
    const fetchFolders = async () => {
      const folders = await client.getFolders({ driveId });
      setFolders(folders);
    };

    fetchFolders();
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      const documents = await client.getDocuments({ driveId });
      setDocuments(documents);
    };

    fetchDocuments();
  }, []);

  const addFolder = async (folderNew: DriveFolderNew) => {
    try {
      const newFolder = await client.createFolder(folderNew);
      setFolders((prev) => [...prev, { ...folderNew, id: newFolder.id }]);
    } catch (e) {
      //catch erro
    }
  };

  const updateFolder = async (folderUpdate: DriveFolderUpdate) => {
    try {
      await client.updateFolder(folderUpdate);
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === folderUpdate.id
            ? { ...folder, name: folderUpdate.name }
            : { ...folder }
        )
      );
    } catch (e) {
      //catch erro
    }
  };

  const moveDocument = async (documentMove: DriveDocumentMove) => {
    try {
      await client.updateDocument({
        id: documentMove.documentId,
        folderId: documentMove.folderId,
      });
      setDocuments((prev) =>
        prev.map((document) =>
          document.id === documentMove.documentId
            ? { ...document, folderId: documentMove.folderId }
            : { ...document }
        )
      );
    } catch (e) {
      //catch erro
    }
  };

  return (
    <DriveContext.Provider
      value={{
        id: driveId,
        documents,
        folders,
        addFolder,
        updateFolder,
        moveDocument,
      }}
    >
      <DriveSearchProvider>
        <DocumentsSelectionProvider>{children}</DocumentsSelectionProvider>
      </DriveSearchProvider>
    </DriveContext.Provider>
  );
};

export function useFolders(): DriveFolder[] {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.folders;
}

export function useAddFolder() {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.addFolder;
}

export function useMoveDocument() {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.moveDocument;
}

export function useUpdateFolder() {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.updateFolder;
}

export function useDrive() {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.id;
}

export function useFolder(folderId: string): DriveFolder | undefined {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.folders.find((folder) => folder.id === folderId);
}

export function useDocuments(): DriveDocument[] {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.documents;
}

export function useDocument(documentId: string): DriveDocument | undefined {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.documents.find((document) => document.id === documentId);
}

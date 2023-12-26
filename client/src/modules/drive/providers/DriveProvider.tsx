import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DriveDocument,
  DriveFolder,
  DriveFolderNew,
  DriveFolderUpdate,
} from "../drive";
import { DriveSearchProvider } from "./DriveSearchProvider";
import { v4 as uuidv4 } from "uuid";

interface DriveContextType {
  id: string;
  documents: DriveDocument[];
  folders: DriveFolder[];
  addFolder: (newFolder: DriveFolderNew) => void;
  updateFolder: (folderUpdate: DriveFolderUpdate) => void;
}

const DriveContext = createContext<DriveContextType | null>(null);

interface DriveProviderProps {
  driveId: string;
  children: ReactNode;
}

export const DriveProvider = ({ children, driveId }: DriveProviderProps) => {
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [documents, setDocuments] = useState<DriveDocument[]>([]);

  useEffect(() => {
    setFolders(defaultFolders);
  }, []);

  useEffect(() => {
    setDocuments(defaultDocuments);
  }, []);

  const addFolder = (folderNew: DriveFolderNew) => {
    const newFolder = { ...folderNew, id: uuidv4() };
    setFolders((prev) => [...prev, newFolder]);
  };

  const updateFolder = (folderUpdate: DriveFolderUpdate) => {
    console.log(folderUpdate)
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderUpdate.id
          ? { ...folder, name: folderUpdate.name }
          : { ...folder }
      )
    );
  };

  return (
    <DriveContext.Provider
      value={{ id: driveId, documents, folders, addFolder,updateFolder }}
    >
      <DriveSearchProvider>{children}</DriveSearchProvider>
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

export function useUpdateFolder() {
  const context = useContext(DriveContext);

  if (context == null) {
    throw new Error();
  }

  return context.updateFolder;
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

const defaultFolders: DriveFolder[] = [
  { id: "folder-1", name: "folder 1" },
  { id: "folder-2", name: "folder 2" },
  { id: "folder-3", name: "folder 3" },
];

const defaultDocuments: DriveDocument[] = [
  { id: "Adezc", name: "document-1", size: 456653289, folderId: "folder-1" },
  { id: "fds", name: "document-2", size: 456653289, folderId: null },
  { id: "dfs", name: "document-3", size: 456653289, folderId: null },
];

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { DriveFolder, DriveFolderNew, DriveFolderUpdate } from "../drive";
import { useDriveClient } from "./DriveClientProvider";

interface DriveFolderContextType {
  folders: DriveFolder[];
  addFolder: (newFolder: DriveFolderNew) => Promise<void>;
  updateFolder: (folderUpdate: DriveFolderUpdate) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
}

const DriveFolderContext = createContext<DriveFolderContextType | null>(null);

interface DriveFolderProviderProps {
  driveId: string;
  children: ReactNode;
}

export const DriveProvider = ({
  children,
  driveId,
}: DriveFolderProviderProps) => {
  const [folders, setFolders] = useState<DriveFolder[]>([]);

  const client = useDriveClient();

  useEffect(() => {
    const fetchFolders = async () => {
      const folders = await client.getFolders({ driveId });
      setFolders(folders);
    };

    fetchFolders();
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

  const deleteFolder = async (folderId: string) => {
    try {
      await client.deleteFolder(folderId);
      setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
    } catch (e) {
      //catch erro
    }
  };

  return (
    <DriveFolderContext.Provider
      value={{
        folders,
        addFolder,
        deleteFolder,
        updateFolder,
      }}
    >
      {children}
    </DriveFolderContext.Provider>
  );
};

export function useFolders(): DriveFolder[] {
  const context = useContext(DriveFolderContext);

  if (context == null) {
    throw new Error();
  }

  return context.folders;
}

export function useAddFolder() {
  const context = useContext(DriveFolderContext);

  if (context == null) {
    throw new Error();
  }

  return context.addFolder;
}

export function useDeleteFolder() {
  const context = useContext(DriveFolderContext);

  if (context == null) {
    throw new Error();
  }

  return context.deleteFolder;
}

export function useUpdateFolder() {
  const context = useContext(DriveFolderContext);

  if (context == null) {
    throw new Error();
  }

  return context.updateFolder;
}

export function useFolder(folderId: string): DriveFolder | undefined {
  const context = useContext(DriveFolderContext);

  if (context == null) {
    throw new Error();
  }

  return context.folders.find((folder) => folder.id === folderId);
}

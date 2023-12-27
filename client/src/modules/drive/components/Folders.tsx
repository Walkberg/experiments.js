import { useFolders } from "../providers/DriveProvider";
import { Folder, FolderProps } from "./Folder";

interface FoldersProps {
  FolderComponent: React.ComponentType<FolderProps>;
}

export const Folders = ({ FolderComponent }: FoldersProps) => {
  const folders = useFolders();

  return (
    <div className="flex flex-col gap-1">
      {folders.map((folder) => (
        <FolderComponent folderId={folder.id} />
      ))}
    </div>
  );
};

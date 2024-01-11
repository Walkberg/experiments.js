import { useFolders } from "../providers/DriveFolderProvider";
import { Folder, FolderProps } from "./Folder";

interface FoldersProps {
  FolderComponent: React.ComponentType<FolderProps>;
}

export const Folders = ({ FolderComponent }: FoldersProps) => {
  const folders = useFolders();

  return (
    <div className="flex flex-col gap-1">
      {folders.map((folder) => (
        <FolderComponent key={folder.id} folderId={folder.id} />
      ))}
    </div>
  );
};

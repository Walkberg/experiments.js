import { useFolders } from "../providers/DriveProvider";
import { Folder } from "./Folder";

interface FoldersProps {}

export const Folders = ({}: FoldersProps) => {
  const folders = useFolders();

  return (
    <div className="flex flex-col gap-1">
      {folders.map((folder) => (
        <Folder folderId={folder.id} />
      ))}
    </div>
  );
};

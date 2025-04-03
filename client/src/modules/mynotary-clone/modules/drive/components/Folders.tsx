import { useFolders } from "../providers/DriveFolderProvider";
import { useSearch } from "../providers/DriveSearchProvider";
import { FolderProps } from "./Folder";

interface FoldersProps {
  FolderComponent: React.ComponentType<FolderProps>;
}

export const Folders = ({ FolderComponent }: FoldersProps) => {
  const folders = useFolders();

  const { search } = useSearch();

  return (
    <div className="flex flex-col gap-1">
      {folders.map((folder) => (
        <FolderComponent
          key={folder.id}
          folderId={folder.id}
          filtered={folder.name.toLowerCase().includes(search.toLowerCase())}
        />
      ))}
    </div>
  );
};

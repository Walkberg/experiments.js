import {
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useDeleteFolder } from "../providers/DriveFolderProvider";

interface FolderDeleteActionProps {
  folderId: string;
}

export const FolderDeleteAction = ({ folderId }: FolderDeleteActionProps) => {
  const deleteFolder = useDeleteFolder();

  const handleDeleteFolder = async () => {
    await deleteFolder(folderId);
  };

  return (
    <DropdownMenuItem onClick={handleDeleteFolder}>
      <DropdownMenuLabel>Supprimer</DropdownMenuLabel>
    </DropdownMenuItem>
  );
};

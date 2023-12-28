import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useDeleteDocument } from "../providers/DriveProvider";

interface DocumentDeleteActionProps {
  documentId: string;
}

export const DocumentDeleteAction = ({
  documentId,
}: DocumentDeleteActionProps) => {
  const deleteDocument = useDeleteDocument();

  const handleDeleteFolder = async () => {
    await deleteDocument(documentId);
  };

  return (
    <DropdownMenuItem onClick={handleDeleteFolder}>
      <DropdownMenuLabel>Supprimer</DropdownMenuLabel>
    </DropdownMenuItem>
  );
};

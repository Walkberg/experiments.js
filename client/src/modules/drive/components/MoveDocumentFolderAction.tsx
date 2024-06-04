import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDocument,
  useMoveDocument,
} from "../providers/DriveDocumentProvider";
import { useFolders } from "../providers/DriveFolderProvider";

interface MoveDocumentFolderActionProps {
  documentId: string;
}

export const MoveDocumentFolderAction = ({
  documentId,
}: MoveDocumentFolderActionProps) => {
  const moveDocument = useMoveDocument();

  const folders = useFolders();
  const document = useDocument(documentId);
  const filteredFolder = folders.filter(
    (folder) => folder.id != document?.folderId
  );

  const handleMoveDoc = async (folderId: string | null) => {
    await moveDocument({ folderId, documentId });
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Move document</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {filteredFolder.map((folder) => (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation;
                handleMoveDoc(folder.id);
              }}
            >
              {folder.name}
            </DropdownMenuItem>
          ))}
          {document?.folderId != null && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation;
                handleMoveDoc(null);
              }}
            >
              auncun
            </DropdownMenuItem>
          )}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

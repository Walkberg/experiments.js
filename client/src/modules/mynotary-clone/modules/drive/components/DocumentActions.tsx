import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { MoveDocumentFolderAction } from "./MoveDocumentFolderAction";
import { DocumentDeleteAction } from "./DocumentDeleteAction";

interface DocumentActionsProps {
  documentId: string;
}

export const DocumentActions = ({ documentId }: DocumentActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <MoveDocumentFolderAction documentId={documentId} />
        <DocumentDeleteAction documentId={documentId} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

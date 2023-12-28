import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { FolderDeleteAction } from "./FolderDeleteAction";

interface FolderActionProps {
  folderId: string;
}

export const FolderActions = ({ folderId }: FolderActionProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Rien</DropdownMenuLabel>
        <FolderDeleteAction folderId={folderId} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

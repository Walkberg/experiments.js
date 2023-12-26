import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Documents } from "./Documents";
import { useFolder } from "../providers/DriveProvider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { FolderActions } from "./FolderActions";
import { useSearch } from "../providers/DriveSearchProvider";
import { FolderName } from "./FolderRename";

interface FolderProps {
  folderId: string;
}

export const Folder = ({ folderId }: FolderProps) => {
  const [isOpened, setIsOpened] = useState(false);

  const { search } = useSearch();
  const folder = useFolder(folderId);

  if (folder == null || !folder.name.includes(search)) {
    return null;
  }

  return (
    <Collapsible open={isOpened} onOpenChange={setIsOpened}>
      <Card className="p-2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpened ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
              <FolderName folderId={folder.id}/>
            </div>
            <FolderActions folderId={folder.id} />
          </div>
          <CollapsibleContent className="space-y-2">
            <Documents folderId={folder.id} />
          </CollapsibleContent>
        </div>
      </Card>
    </Collapsible>
  );
};

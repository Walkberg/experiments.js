import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Documents } from "./Documents";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useSearch } from "../providers/DriveSearchProvider";
import { FolderSelection } from "./FolderSelection";
import { BasicDocument } from "./BasicDocument";
import { useFolder } from "../providers/DriveFolderProvider";

export interface FolderProps {
  folderId: string;
  filtered: boolean;
}

export const BasicFolder = ({ folderId, filtered }: FolderProps) => {
  const [isOpened, setIsOpened] = useState(false);

  const folder = useFolder(folderId);

  if (folder == null) {
    return null;
  }

  return (
    <Collapsible open={isOpened} onOpenChange={setIsOpened}>
      <Card className="p-2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpened ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
              <FolderSelection folderId={folder.id} />
              {folder.name}
            </div>
          </div>
          <CollapsibleContent className="space-y-2">
            <Documents
              folderId={folder.id}
              DocumentComponent={BasicDocument}
              filtered={filtered}
            />
          </CollapsibleContent>
        </div>
      </Card>
    </Collapsible>
  );
};

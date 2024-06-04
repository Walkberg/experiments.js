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
import { FolderActions } from "./FolderActions";
import { useSearch } from "../providers/DriveSearchProvider";
import { FolderName } from "./FolderRename";
import { FolderSelection } from "./FolderSelection";
import { Document } from "./Document";
import { selectDocumentsByFolderId } from "../documents.selector";
import { Badge } from "@/components/ui/badge";
import { DocumentUploadArea } from "./DocumentUploadArea";
import { DocumentAdd } from "./DocumentAdd";
import { DropZone } from "./DropZone";
import { useFolder } from "../providers/DriveFolderProvider";
import { useDocuments } from "../providers/DriveDocumentProvider";

export interface FolderProps {
  folderId: string;
  filtered: boolean;
}

export const Folder = ({ folderId, filtered }: FolderProps) => {
  const [isOpened, setIsOpened] = useState(false);

  const folder = useFolder(folderId);

  const documents = useDocuments(selectDocumentsByFolderId(folderId));

  if (folder == null) {
    return null;
  }

  return (
    <DropZone id={folderId}>
      <Collapsible open={isOpened} onOpenChange={setIsOpened}>
        <DocumentUploadArea folderId={folderId}>
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
                  <FolderSelection folderId={folderId} />
                  <FolderName folderId={folderId} />
                </div>
                <div>
                  <Badge>{documents.length} items</Badge>
                  <FolderActions folderId={folderId} />
                </div>
              </div>
              <CollapsibleContent className="space-y-2">
                <Documents
                  folderId={folderId}
                  DocumentComponent={Document}
                  filtered={filtered}
                />
                <DocumentAdd folderId={folderId} />
              </CollapsibleContent>
            </div>
          </Card>
        </DocumentUploadArea>
      </Collapsible>
    </DropZone>
  );
};

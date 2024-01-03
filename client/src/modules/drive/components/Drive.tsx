import { DriveProvider } from "../providers/DriveProvider";
import { Documents } from "./Documents";
import { Document } from "./Document";
import { DriveSearch } from "./DriveSearch";
import { FolderAdd } from "./FolderAdd";
import { Folders } from "./Folders";
import { Folder } from "./Folder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentUploadArea } from "./DocumentUploadArea";
import { DocumentAdd } from "./DocumentAdd";

interface DriveProps {
  driveId: string;
}

export const Drive = ({ driveId }: DriveProps) => {
  return (
    <DriveProvider driveId={driveId}>
      <div className="flex flex-col gap-2 p-8">
        <div className="flex flex-row gap-2 justify-between">
          <DriveSearch />
          <FolderAdd />
        </div>
        <ScrollArea className="h-80  rounded-md border">
          <Folders FolderComponent={Folder} />
          <div>
            ---------------------------------------- separator
            -------------------------------------------------
          </div>
          <DocumentUploadArea>
            <Documents DocumentComponent={Document} />
            <DocumentAdd />
          </DocumentUploadArea>
        </ScrollArea>
      </div>
    </DriveProvider>
  );
};

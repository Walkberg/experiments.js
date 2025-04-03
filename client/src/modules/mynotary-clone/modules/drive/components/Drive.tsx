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
import { DropZone } from "./DropZone";
import { DriveDndContext, EMPTY_FOLDER_AREA } from "./DriveDndContext";

interface DriveProps {
  driveId: string;
}

export const Drive = ({ driveId }: DriveProps) => {
  return (
    <DriveProvider driveId={driveId}>
      <DriveDndContext>
        <div className="flex flex-col gap-2 p-8">
          <div className="flex flex-row gap-2 justify-between">
            <DriveSearch />
            <FolderAdd />
          </div>
          <div className="grid grid-cols-4 gap-4 r">
            <div className="flex justify-center">nom</div>
            <div className="flex justify-center">annexé dans</div>
            <div className="flex justify-center">dans contrat</div>
            <div className="flex justify-center"></div>
          </div>
          <ScrollArea className="h-80  rounded-md border">
            <Folders FolderComponent={Folder} />
            <div>
              ---------------------------------------- separator
              -------------------------------------------------
            </div>
            <DropZone id={EMPTY_FOLDER_AREA}>
              <DocumentUploadArea>
                <Documents DocumentComponent={Document} />
                <DocumentAdd />
              </DocumentUploadArea>
            </DropZone>
          </ScrollArea>
        </div>
      </DriveDndContext>
    </DriveProvider>
  );
};

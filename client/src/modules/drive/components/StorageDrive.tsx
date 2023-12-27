import { DriveProvider } from "../providers/DriveProvider";
import { Documents } from "./Documents";
import { DriveSearch } from "./DriveSearch";
import { Folders } from "./Folders";
import { BasicDocument } from "./BasicDocument";
import { BasicFolder } from "./BasicFolder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface DriveProps {
  driveId: string;
}

export const StorageDrive = ({ driveId }: DriveProps) => {
  return (
    <DriveProvider driveId={driveId}>
      <div className="flex flex-col gap-2 p-8">
        <div className="flex flex-row gap-2 justify-between">
          <DriveSearch />
        </div>
        <ScrollArea className="h-80  rounded-md border">
          <Folders FolderComponent={BasicFolder} />
          <Documents DocumentComponent={BasicDocument} />
        </ScrollArea>
        <Button>Accepter</Button>
      </div>
    </DriveProvider>
  );
};

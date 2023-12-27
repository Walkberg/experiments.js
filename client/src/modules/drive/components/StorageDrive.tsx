import { DriveProvider } from "../providers/DriveProvider";
import { Documents } from "./Documents";
import { DriveSearch } from "./DriveSearch";
import { Folders } from "./Folders";
import { BasicDocument } from "./BasicDocument";
import { BasicFolder } from "./BasicFolder";

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
        <Folders FolderComponent={BasicFolder} />
        <Documents DocumentComponent={BasicDocument} />
      </div>
    </DriveProvider>
  );
};

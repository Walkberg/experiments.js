import { DriveProvider } from "../providers/DriveProvider";
import { Documents } from "./Documents";
import { Document } from "./Document";
import { DriveSearch } from "./DriveSearch";
import { FolderAdd } from "./FolderAdd";
import { Folders } from "./Folders";
import { Folder } from "./Folder";

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

        <Folders FolderComponent={Folder} />
        <div>
          ---------------------------------------- separator
          -------------------------------------------------
        </div>
        <Documents DocumentComponent={Document} />
      </div>
    </DriveProvider>
  );
};

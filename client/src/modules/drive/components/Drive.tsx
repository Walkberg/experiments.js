import { DriveProvider } from "../providers/DriveProvider";
import { Documents } from "./Documents";
import { DriveSearch } from "./DriveSearch";
import { FolderAdd } from "./FolderAdd";
import { Folders } from "./Folders";

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

        <Folders />
        <div>
          ---------------------------------------- separator
          -------------------------------------------------
        </div>
        <Documents />
      </div>
    </DriveProvider>
  );
};

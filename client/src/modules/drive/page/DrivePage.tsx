import { Documents } from "../components/Documents";
import { DriveSearch } from "../components/DriveSearch";
import { FolderAdd } from "../components/FolderAdd";
import { Folders } from "../components/Folders";
import { DriveProvider } from "../providers/DriveProvider";

export const DrivePage = () => {
  return (
    <DriveProvider>
      <div className="flex flex-col gap-2 p-8">
        <div className="flex flex-row gap-1 justify-between">
          <DriveSearch />
          <FolderAdd />
        </div>
        <Folders />
        <Documents />
      </div>
    </DriveProvider>
  );
};

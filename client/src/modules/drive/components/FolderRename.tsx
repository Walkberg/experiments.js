import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FolderIcon, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFolder, useUpdateFolder } from "../providers/DriveFolderProvider";

interface FolderRenameProps {
  folderId: string;
}

export const FolderName = ({ folderId }: FolderRenameProps) => {
  const [name, setName] = useState("");
  const [edit, setEdit] = useState(false);

  const updateFolder = useUpdateFolder();

  const folder = useFolder(folderId);

  if (folder == null) {
    return;
  }

  const handleUpdate = async () => {
    await updateFolder({ name: name, id: folderId });
    setEdit(false);
    setName("");
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <FolderIcon />
      {edit ? (
        <div className="flex flex-row gap-2 items-center">
          <form
            className="flex flex-row gap-2 items-center"
            onSubmit={handleUpdate}
          >
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit" onClick={handleUpdate}>
              Modifier
            </Button>
          </form>
          <Button onClick={() => setEdit(false)} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          {folder.name}
          <Button variant="ghost" size="sm" onClick={() => setEdit(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

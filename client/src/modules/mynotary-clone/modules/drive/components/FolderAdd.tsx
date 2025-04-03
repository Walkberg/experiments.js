import { Button } from "@/components/ui/button";
import { useDrive } from "../providers/DriveProvider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAddFolder } from "../providers/DriveFolderProvider";

interface FolderAddProps {}

export const FolderAdd = ({}: FolderAddProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const driveId = useDrive();

  const addFolder = useAddFolder();

  const handleAddFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addFolder({ name: name, driveId });
    setName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Creer un dossier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form className="flex flex-col gap-4" onSubmit={handleAddFolder}>
          <Input
            autoFocus
            onChange={(e) => setName(e.target.value)}
            id="name"
            value={name}
            className="col-span-3"
          />
          <Button type="submit">Créer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

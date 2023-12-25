import { Button } from "@/components/ui/button";
import { useAddFolder } from "../providers/DriveProvider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FolderAddProps {}

export const FolderAdd = ({}: FolderAddProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const addFolder = useAddFolder();

  const handleAddFolder = () => {
    addFolder({ name: name });
    setName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Creer un dossier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Input
          onChange={(e) => setName(e.target.value)}
          id="name"
          value={name}
          className="col-span-3"
        />
        <DialogFooter>
          <Button type="submit" onClick={handleAddFolder}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

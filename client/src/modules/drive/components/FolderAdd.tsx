import { Button } from "@/components/ui/button";
import { useAddFolder } from "../providers/DriveProvider";

interface FolderAddProps {}

export const FolderAdd = ({}: FolderAddProps) => {
  const addFolder = useAddFolder();

  return (
    <Button onClick={() => addFolder({ name: "cool" })}>
      Creer un dossier
    </Button>
  );
};

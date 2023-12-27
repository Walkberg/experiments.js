import { useEffect, useState } from "react";
import { ContractList } from "../components/ContractList";
import { Contract } from "../contract";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StorageDrive } from "@/modules/drive/components/StorageDrive";

export const ContractPage = () => {
  const [contracts, setContract] = useState<Contract[]>([]);

  useEffect(() => {
    setContract([{ id: "uij" }, { id: "uij" }, { id: "uij" }, { id: "uij" }]);
  }, []);

  return (
    <div className="m-9">
      <ContractList contracts={contracts} />
      <Dialog>
        <DialogTrigger asChild>
          <Button>test</Button>
        </DialogTrigger>
        <DialogContent>
          <StorageDrive driveId={"drive-1"} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

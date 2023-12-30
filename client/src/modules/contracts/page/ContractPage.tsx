import { useEffect, useState } from "react";
import { ContractList } from "../components/ContractList";
import { Contract } from "../contract";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StorageDrive } from "@/modules/drive/components/StorageDrive";

const initialValues = [
  { id: "uij", operationId: "operation-1" },
  { id: "uij", operationId: "operation-1" },
  { id: "uij", operationId: "operation-1" },
  { id: "uij", operationId: "operation-1" },
];

export const ContractPage = () => {
  const [contracts, setContract] = useState<Contract[]>([]);

  useEffect(() => {
    setContract(initialValues);
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

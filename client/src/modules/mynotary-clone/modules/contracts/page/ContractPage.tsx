import { ContractList } from "../components/ContractList";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StorageDrive } from "@/modules/drive/components/StorageDrive";
import { useParams } from "react-router";
import { ContractAdd } from "../components/ContractAdd";

export const ContractPage = () => {
  const { operationId } = useParams();

  if (operationId == null) {
    throw new Error();
  }

  return (
    <div>
      <div className="flex flex-row-reverse">
        <ContractAdd operationId={operationId} />
      </div>
      <ContractList />
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

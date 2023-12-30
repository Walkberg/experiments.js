import { useEffect, useState } from "react";
import { ContractList } from "../components/ContractList";
import { Contract } from "../contract";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StorageDrive } from "@/modules/drive/components/StorageDrive";
import { ContractClientProvider } from "../providers/ContractClientProvider";
import { ContractProvider } from "../providers/ContractProvider";
import { useParams } from "react-router";

export const ContractPage = () => {


  const { operationId } = useParams();

  if (operationId == null) {
    throw new Error();
  }

  return (
    <ContractProvider operationId={operationId}>
      <ContractList  />
      <Dialog>
        <DialogTrigger asChild>
          <Button>test</Button>
        </DialogTrigger>
        <DialogContent>
          <StorageDrive driveId={"drive-1"} />
        </DialogContent>
      </Dialog>
    </ContractProvider>
  );
};

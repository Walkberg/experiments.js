import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useBranch } from "../useBranch";
import { RecordCreateOrSearch } from "@/modules/records/components/RecordCreateOrSearch";
import { BranchApiImpl } from "../branch.api";

const branchApi = new BranchApiImpl();

interface BranchRecordAddProps {
  branchId: string;
}

export const BranchRecordAdd = ({ branchId }: BranchRecordAddProps) => {
  const { branch } = useBranch(branchId);

  const [open, setOpen] = useState(false);

  const handleAddBranchRecord = async (recordId: string) => {
    // do server logic recordId, branchId

    try {
      await branchApi.createBranchRecord({ branchId, recordId });
      setOpen(false);
    } catch (e) {
      // handle eeror
    }
  };

  const canHadMoreRecord =
    branch.config.creation.maxRecordCount > branch.recordIds.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!canHadMoreRecord} variant="outline">
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <RecordCreateOrSearch onValidate={handleAddBranchRecord} />
      </DialogContent>
    </Dialog>
  );
};

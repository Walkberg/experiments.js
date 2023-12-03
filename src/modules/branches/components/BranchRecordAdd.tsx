import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useBranch } from "../useBranch";
import { RecordCreateOrSearch } from "@/modules/records/components/RecordCreateOrSearch";

interface BranchRecordAddProps {}

export const BranchRecordAdd = ({}: BranchRecordAddProps) => {
  const { branch, addRecord } = useBranch();

  const [open, setOpen] = useState(false);

  const handleAddBranchRecord = async (recordId: string) => {
    await addRecord(recordId);
    setOpen(false);
  };

  if (branch == null) {
    return;
  }

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

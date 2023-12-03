import { Card, CardContent } from "@/components/ui/card";
import { ReactNode, useState } from "react";
import { RecordDetail } from "./RecordDetail";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/components/ui/dialog";

interface RecordProps {
  recordId: string;
  actions?: ReactNode;
}

export const Record = ({ recordId, actions }: RecordProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="w-full cursor-pointer" onClick={() => setOpen(true)}>
        <div className="flex justify-between items-center p-6">
          Record dfdsfd {recordId}
          {actions}
        </div>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <RecordDetail recordId={"recordId"} />
        </DialogContent>
      </Dialog>
    </>
  );
};

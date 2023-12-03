import { Card } from "@/components/ui/card";
import { ReactNode, createContext, useEffect, useState } from "react";
import { RecordDetail } from "./RecordDetail";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/components/ui/dialog";
import { RecordLink, Recorde } from "../record";
import { useRecord } from "../useRecord";
import { RecordApiImpl } from "../record.api";

interface RecordProps {
  actions?: ReactNode;
}

export const Record = ({ actions }: RecordProps) => {
  const { record, status } = useRecord();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return <div>... loading</div>;
  }

  return (
    <>
      <Card className="w-full cursor-pointer" onClick={() => setOpen(true)}>
        <div className="flex justify-between items-center p-6">
          Record dfdsfd {record?.id}
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


import { Card } from "@/components/ui/card";
import { ReactNode, createContext, useEffect, useState } from "react";
import { RecordDetail } from "./RecordDetail";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/components/ui/dialog";
import { Recorde } from "../record";
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

const recordApi = new RecordApiImpl();

export type RecordStatus = "pending" | "loading" | "success" | "error";

interface RecordResponse {
  record: Recorde | null;
  status: RecordStatus;
}

export const RecordContext = createContext<RecordResponse | null>(null);

interface BranchProviderProps {
  recordId: string;
  children: ReactNode;
}

export const RecordProvider = ({ recordId, children }: BranchProviderProps) => {
  const [record, setRecord] = useState<Recorde | null>(null);
  const [status, setStatus] = useState<RecordStatus>("pending");

  useEffect(() => {
    const fetchRecord = async () => {
      setStatus("loading");
      try {
        const record = await recordApi.getRecord(recordId);
        setRecord(record);
        setStatus("success");
      } catch (e) {
        setStatus("error");
      }
    };

    fetchRecord();
  }, []);

  return (
    <RecordContext.Provider value={{ record: record, status }}>
      {children}
    </RecordContext.Provider>
  );
};

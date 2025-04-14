import { useEffect } from "react";
import {
  RecordProvider,
  useRecords,
} from "../providers/RecordPersistenceProvider";
import { RecordNew } from "../record";
import { Recorde } from "../record";
import { RecordTile } from "../components/RecordTile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRecordClient } from "../providers/RecordClientProvider";
import { RecordCreate } from "../components/RecordCreate";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { FormComponent } from "../../form/FormComponent";
import { useRecordConfigs } from "../providers/RecordConfigProvider";

export function RecordPage() {
  return (
    <RecordProvider>
      <RecordPageContent />
    </RecordProvider>
  );
}

function RecordPageContent() {
  const { records, setRecords } = useRecords();

  const { fetchRecords } = useFetchRecords();

  useEffect(() => {
    fetchRecords({
      onRecordsFetched: setRecords,
    });
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Records</h1>
        <RecordCreate onValidate={() => {}} />
      </div>
      <ScrollArea className="h-[80vh] w-full rounded-md border p-4 space-y-2">
        <div className="flex flex-col gap-2">
          {records.map((record) => (
            <Dialog>
              <DialogTrigger asChild>
                <RecordTile key={record.id} record={record} />
              </DialogTrigger>
              <DialogContent>
                <RecordDetail record={record} />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function RecordDetail({ record }: { record: Recorde }) {
  const { recordConfigs } = useRecordConfigs();

  const form = recordConfigs[record.type]?.form ?? { questions: [] };

  return (
    <div>
      <h1>{record.id}</h1>
      <FormComponent display={"row"} form={form} onSubmit={() => {}} />
    </div>
  );
}

function useFetchRecords() {
  const client = useRecordClient();

  const fetchRecords = async ({
    onRecordsFetched,
  }: {
    onRecordsFetched: (records: Recorde[]) => void;
  }) => {
    const records = await client.getRecords({ search: "" });
    onRecordsFetched(records);
  };

  return { fetchRecords };
}

interface UseRecordCreationOptions {
  onRecordCreated: (record: Recorde) => void;
}

export function useRecordCreation() {
  const client = useRecordClient();

  const createRecord = async (
    recordNew: RecordNew,
    options: UseRecordCreationOptions
  ) => {
    const record = await client.createRecord(recordNew);
    options.onRecordCreated(record);
  };

  return { createRecord };
}

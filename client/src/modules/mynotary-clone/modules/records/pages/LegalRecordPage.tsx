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
import { Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermission } from "../../user-permissions/use-permission";
import { useRecord } from "../useRecord";
import { Button } from "@/components/ui/button";

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
        <h1 className="text-xl font-semibold">Fiches</h1>
        <RecordFiltering />
        <RecordCreate onValidate={() => {}} />
      </div>
      <div>
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
        <RecordCreate
          onValidate={() => {}}
          trigger={
            <CreatePlaceholder>Créer un nouvelle fiche</CreatePlaceholder>
          }
        />
      </div>
    </div>
  );
}

export const CreatePlaceholder = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "flex items-center justify-center rounded-xl border-2 border-dashed",
        "h-24 w-full cursor-pointer transition-colors",
        "hover:bg-green-50 hover:border-green-500"
      )}
    >
      <Plus />
      {props.children}
    </button>
  );
});

function RecordFiltering({}: {}) {
  return (
    <Tabs defaultValue="my">
      <TabsList className="ml-auto">
        <TabsTrigger value={"my"}>Mes fiches</TabsTrigger>
        <TabsTrigger value={"all"}>Toutes les fiches</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function RecordDetail({ record }: { record: Recorde }) {
  const { recordConfigs } = useRecordConfigs();

  const form = recordConfigs.find((config) => config.id === record.type)
    ?.form ?? {
    questions: [],
  };

  return (
    <div>
      <h1>{record.id}</h1>
      <FormComponent
        display={"row"}
        form={form}
        defaultValues={record.answers}
        onSubmit={() => {}}
      />
    </div>
  );
}

export function RecordDelete({ record }: { record: Recorde }) {
  const canDelete = usePermission("record", "delete");

  const { deleteRecord } = useRecordDeletion();
  const { removeRecord } = useRecords();

  const handleRecordDeleted = async (recordId: string) => {
    removeRecord(recordId);
  };

  const handleDeleteRecord = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await deleteRecord(record.id, {
      onRecordDeleted: handleRecordDeleted,
    });
  };

  return (
    <Button
      disabled={!canDelete || status === "creating"}
      variant={"ghost"}
      onClick={handleDeleteRecord}
    >
      <Trash />
    </Button>
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

interface UseRecordDeletionOptions {
  onRecordDeleted: (recordId: string) => void;
}

export function useRecordDeletion() {
  const client = useRecordClient();

  const deleteRecord = async (
    recordId: string,
    options: UseRecordDeletionOptions
  ) => {
    const record = await client.deleteRecord(recordId);
    options.onRecordDeleted(recordId);
  };

  return { deleteRecord };
}

import { useEffect } from "react";
import { useRecordConfigs } from "../providers/RecordConfigProvider";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RecordConfig,
  RecordConfigNew,
  RecordConfigType,
} from "../record-configs";
import { Controller, useForm } from "react-hook-form";
import { useRecordConfigClient } from "../providers/RecordConfigClientProvider";

export function RecordConfigPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Configurations de fiche</h1>
      <RecordConfigCreate />
      <RecordConfigList />
    </div>
  );
}

function RecordConfigList() {
  const { fetchRecordConfigs } = useFetchRecordConfigs();
  const { recordConfigs, setRecordConfigs } = useRecordConfigs();

  useEffect(() => {
    fetchRecordConfigs({
      onRecordConfigsFetched: setRecordConfigs,
    });
  }, []);

  return (
    <ScrollArea className="h-[60vh] w-full rounded-md border p-4 space-y-2">
      {recordConfigs.map((config) => (
        <RecordConfigTile key={config.id} config={config} />
      ))}
    </ScrollArea>
  );
}

function RecordConfigTile({ config }: { config: RecordConfig }) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold">{config.label}</h2>
      <p className="text-sm text-muted-foreground">Type : {config.type}</p>
      <p className="text-sm text-muted-foreground">ID : {config.id}</p>
    </Card>
  );
}

type FormResponse = {
  type: "person" | "property";
  label: string;
};

function RecordConfigCreate() {
  const { createRecordConfig } = useRecordConfigCreation();
  const { addRecordConfig } = useRecordConfigs();

  const { handleSubmit, register, control, reset } = useForm<FormResponse>({
    defaultValues: {
      type: "person",
    },
  });

  const handleRecordConfigCreated = (config: RecordConfig) => {
    addRecordConfig(config);
    reset();
  };

  const handleCreate = async (response: FormResponse) => {
    const newConfig: RecordConfigNew = {
      label: response.label,
      type: response.type,
    };

    createRecordConfig(newConfig, {
      onRecordConfigCreated: handleRecordConfigCreated,
    });

    reset();
  };

  return (
    <div className="flex items-end gap-4">
      <Dialog>
        <DialogTrigger>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Créer
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div className="space-y-1">
              <Label className="block text-sm font-medium">Nom</Label>
              <Input
                placeholder="Ex: Société civile"
                {...register("label", { required: true })}
              />
            </div>
            <div className="space-y-1">
              <Label className="block text-sm font-medium">Type</Label>
              <Controller
                name={"type"}
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    className="border rounded-md px-2 py-1"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={"type de fiche"} />
                    </SelectTrigger>
                    <SelectContent>
                      {recordConfigTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <Button type="submit">Créer</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const recordConfigTypeOptions: {
  value: RecordConfigType;
  name: string;
}[] = [
  { value: "person", name: "Personne" },
  { value: "property", name: "Propriété" },
];

export function useFetchRecordConfigs() {
  const client = useRecordConfigClient();

  const fetchRecordConfigs = async ({
    onRecordConfigsFetched,
  }: {
    onRecordConfigsFetched: (configs: RecordConfig[]) => void;
  }) => {
    const configs = await client.getRecordConfigs();
    onRecordConfigsFetched(configs);
  };

  return { fetchRecordConfigs };
}

interface UseRecordConfigCreationOptions {
  onRecordConfigCreated: (config: RecordConfig) => void;
}

export function useRecordConfigCreation() {
  const client = useRecordConfigClient();

  const createRecordConfig = async (
    configNew: RecordConfigNew,
    options: UseRecordConfigCreationOptions
  ) => {
    const config = await client.createRecordConfig(configNew);
    options.onRecordConfigCreated(config);
  };

  return { createRecordConfig };
}

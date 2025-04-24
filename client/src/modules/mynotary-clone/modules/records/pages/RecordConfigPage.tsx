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
import { FormQuestion, QuestionType } from "../../form/form";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();
  return (
    <Card className="p-4" onClick={() => navigate(config.id)}>
      <h2 className="text-lg font-semibold">{config.label}</h2>
      <p className="text-sm text-muted-foreground">Type : {config.type}</p>
      <p className="text-sm text-muted-foreground">ID : {config.id}</p>
    </Card>
  );
}

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: "string", label: "Texte" },
  { value: "number", label: "Nombre" },
  { value: "boolean", label: "Oui / Non" },
  { value: "select", label: "Liste de choix" },
  { value: "user", label: "Utilisateur" },
];

type QuestionForm = {
  label: string;
  name: string;
  placeholder: string;
  type: QuestionType;
};

export function RecordConfigDetail({
  config,
  onUpdate,
}: {
  config: RecordConfig;
  onUpdate: (updated: RecordConfig) => void;
}) {
  const { createRecordConfigQuestion } = useAddQuestionToRecordConfig();
  const { addQuestionToRecordConfig } = useRecordConfigs();

  const { register, handleSubmit, control, reset } = useForm<QuestionForm>({
    defaultValues: {
      label: "",
      name: "",
      placeholder: "",
      type: "string",
    },
  });

  const handleQuestionCreated = (question: FormQuestion) => {
    addQuestionToRecordConfig(config.id, question);
  };

  const onSubmit = async (data: QuestionForm) => {
    const question: FormQuestion = {
      ...data,
      required: true,
      ...(data.type === "select" ? { options: [] } : {}),
    } as FormQuestion;

    await createRecordConfigQuestion(config.id, question, {
      onQuestionRecordConfigCreated: handleQuestionCreated,
    });

    reset();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Ajouter une question</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Intitulé</Label>
          <Input
            {...register("label", { required: true })}
            placeholder="Nom complet"
          />
        </div>
        <div>
          <Label>Nom technique</Label>
          <Input
            {...register("name", { required: true })}
            placeholder="ex: full_name"
          />
        </div>
        <div>
          <Label>Placeholder</Label>
          <Input
            {...register("placeholder")}
            placeholder="Entrez une valeur..."
          />
        </div>
        <div>
          <Label>Type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisissez un type" />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <Button type="submit">Ajouter</Button>
      </form>
    </div>
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

interface useAddQuestionToRecordConfigOptions {
  onQuestionRecordConfigCreated: (formQuestion: FormQuestion) => void;
}

export function useAddQuestionToRecordConfig() {
  const client = useRecordConfigClient();

  const createRecordConfigQuestion = async (
    configId: string,
    question: FormQuestion,
    options: useAddQuestionToRecordConfigOptions
  ) => {
    await client.addQuestionToRecordConfig(configId, question);
    options.onQuestionRecordConfigCreated(question);
  };

  return { createRecordConfigQuestion };
}

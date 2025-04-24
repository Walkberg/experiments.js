import { useParams } from "react-router";
import { useRecordConfigClient } from "../providers/RecordConfigClientProvider";
import { useAddQuestionToRecordConfig } from "./RecordConfigPage";
import { ReactNode, useEffect, useState } from "react";
import { RecordConfig } from "../record-configs";
import { useRecordConfigs } from "../providers/RecordConfigProvider";
import { FormQuestion, FormType } from "../../form/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Hash,
  List,
  Trash,
  Text,
  User,
  ToggleLeft,
  Phone,
  Mail,
  Eye,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormComponent } from "../../form/FormComponent";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function RecordConfigDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { fetchRecordConfig } = useFetchRecordConfig();

  const { setRecordConfigs, recordConfigs } = useRecordConfigs();

  const currentConfig = recordConfigs.find((config) => config.id === id);

  useEffect(() => {
    if (!id) return;

    fetchRecordConfig(id, {
      onRecordConfigFetched: (config) => setRecordConfigs([config]),
    });
  }, [id]);

  if (!currentConfig) return <div>Loading...</div>;

  return (
    <div className="p-4 space-y-4 flex flex-row ">
      <div className="p-4 space-y-4 flex flex-col ">
        <FormFieldList
          label="Basics Fields"
          configId={currentConfig.id}
          fieldConfigs={basicFieldConfigs}
        />
        <FormFieldList
          label="Advanced Fields"
          configId={currentConfig.id}
          fieldConfigs={advancedFieldConfigs}
        />
      </div>
      <div className="flex-1 p-4 space-y-4">
        <h1 className="text-xl font-bold">Configurations de fiche</h1>
        <div className="flex flex-row gap-4">
          <Input
            className="text-sm text-muted-foreground"
            value={currentConfig.label}
          />
          <FormPreview form={currentConfig.form} />
        </div>
        <FormFieldsList form={currentConfig.form} configId={currentConfig.id} />
      </div>
    </div>
  );
}

export const FormPreview = ({ form }: { form: FormType }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] h-[500px]">
        <div className="flex flex-col gap-4 p-4">
          <h1 className="text-xl font-bold">Aperçu du formulaire</h1>
          <FormComponent form={form} display={"column"} onSubmit={() => {}} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const FormFieldsList = ({
  form,
  configId,
}: {
  form: FormType;
  configId: string;
}) => {
  return (
    <div className="pt-6">
      <h3 className="text-md font-semibold">Questions existantes</h3>
      <ScrollArea>
        {form.questions.map((question) => (
          <FormQuestionEdit
            key={question.name}
            question={question}
            configId={configId}
          />
        ))}
      </ScrollArea>
    </div>
  );
};

export const FormQuestionEdit = ({
  question,
  configId,
}: {
  question: FormQuestion;
  configId: string;
}) => {
  return (
    <div key={question.name} className="border p-2 rounded-md">
      <div className="flex items-center gap-2">
        <div>
          <div className="text-xs text-muted-foreground flex flex-col gap-2">
            <Input type="text" placeholder={question.name} className="w-full" />
            <Input
              type="text"
              placeholder={question.label}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">{question.type}</div>
            <Input
              type="text"
              placeholder={question.placeholder}
              className="w-full"
            />
          </div>
        </div>
        <DeleteQuestionButton configId={configId} questionId={question.name} />
      </div>
    </div>
  );
};

const basicFieldConfigs: FieldConfig[] = [
  {
    icon: <Text className="h-5 w-5 text-primary" />,
    defaultValue: {
      name: "text_field",
      label: "Texte",
      type: "string",
      placeholder: "Entrez un texte",
      required: true,
    },
  },
  {
    icon: <Hash className="h-5 w-5 text-primary" />,
    defaultValue: {
      name: "number_field",
      label: "Nombre",
      type: "number",
      placeholder: "Entrez un nombre",
      required: true,
    },
  },
  {
    icon: <List className="h-5 w-5 text-primary" />,
    defaultValue: {
      name: "select_field",
      label: "Sélection",
      type: "select",
      placeholder: "Choisissez une option",
      required: true,
      options: [
        { name: "Option 1", value: "option1" },
        { name: "Option 2", value: "option2" },
      ],
    },
  },
  {
    icon: <ToggleLeft className="h-5 w-5 text-primary" />,
    defaultValue: {
      name: "active",
      label: "Oui/Non",
      type: "boolean",
      placeholder: "Actif ou non",
      required: false,
    },
  },
  {
    icon: <Mail className="w-5 h-5 text-primary" />,
    defaultValue: {
      type: "string",
      name: "email",
      label: "Email",
      placeholder: "ex: jean.dupont@email.com",
      required: true,
    },
  },
  {
    icon: <Phone className="w-5 h-5 text-primary" />,
    defaultValue: {
      type: "string",
      name: "phone",
      label: "Téléphone",
      placeholder: "ex: +33 6 12 34 56 78",
      required: true,
    },
  },
];

const advancedFieldConfigs: FieldConfig[] = [
  {
    icon: <User className="h-5 w-5 text-primary" />,
    defaultValue: {
      name: "1",
      label: "Membres",
      type: "user",
      placeholder: "Enter text",
      required: true,
    },
  },
];

export type FieldConfig = {
  icon: ReactNode;
  defaultValue: FormQuestion;
};

const FormFieldList = ({
  configId,
  fieldConfigs,
  label,
}: {
  label: string;
  configId: string;
  fieldConfigs: FieldConfig[];
}) => {
  const { createRecordConfigQuestion } = useAddQuestionToRecordConfig();
  const { addQuestionToRecordConfig } = useRecordConfigs();

  const handleAddQuestion = async (fieldConfig: FormQuestion) => {
    await createRecordConfigQuestion(configId, fieldConfig, {
      onQuestionRecordConfigCreated: () =>
        addQuestionToRecordConfig(configId, fieldConfig),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">{label}</h1>
      <div className="grid grid-cols-2 gap-4">
        {fieldConfigs.map((fieldConfig) => (
          <FieldCard
            field={fieldConfig}
            key={fieldConfig.defaultValue.name}
            onClick={() => handleAddQuestion(fieldConfig.defaultValue)}
          />
        ))}
      </div>
    </div>
  );
};

interface FieldCardProps {
  field: FieldConfig;
  onClick: () => void;
}

export const FieldCard = ({ field, onClick }: FieldCardProps) => {
  return (
    <div
      className={
        "p-4 flex flex-col items-center gap-4 cursor-pointer transition-all border hover:border-primary hover:shadow-md rounded-2xl"
      }
      onClick={onClick}
    >
      <div>{field.icon}</div>
      <div className="flex-1">
        <div className="text-base font-medium">{field.defaultValue.label}</div>
      </div>
    </div>
  );
};

export function useFetchRecordConfig() {
  const client = useRecordConfigClient();

  const fetchRecordConfig = async (
    id: string,
    {
      onRecordConfigFetched,
    }: {
      onRecordConfigFetched: (config: RecordConfig) => void;
    }
  ) => {
    const config = await client.getRecordConfig(id);
    onRecordConfigFetched(config);
  };

  return { fetchRecordConfig };
}

export function useRemoveQuestionFromRecordConfig() {
  const client = useRecordConfigClient();

  const deleteQuestion = async (
    configId: string,
    questionId: string,
    { onQuestionDeleted }: { onQuestionDeleted: () => void }
  ) => {
    await client.removeQuestionFromRecordConfig(configId, questionId);
    onQuestionDeleted();
  };

  return { deleteQuestion };
}

type Props = {
  configId: string;
  questionId: string;
};

export const DeleteQuestionButton = ({ configId, questionId }: Props) => {
  const { deleteQuestion } = useRemoveQuestionFromRecordConfig();
  const { removeQuestionFromRecordConfig } = useRecordConfigs();

  const handleDelete = async () => {
    await deleteQuestion(configId, questionId, {
      onQuestionDeleted: () =>
        removeQuestionFromRecordConfig(configId, questionId),
    });
  };

  return (
    <Button
      variant="ghost"
      className="text-destructive hover:bg-red-50"
      onClick={handleDelete}
    >
      <Trash className="h-4 w-4" />
    </Button>
  );
};

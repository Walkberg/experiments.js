import { useParams } from "react-router";
import { useRecordConfigClient } from "../providers/RecordConfigClientProvider";
import { useAddQuestionToRecordConfig } from "./RecordConfigPage";
import { ReactNode, useEffect, useState } from "react";
import { RecordConfig } from "../record-configs";
import { useRecordConfigs } from "../providers/RecordConfigProvider";
import {
  FormElement,
  FormType,
  QuestionType,
  SelectQuestion,
} from "../../form/form";
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
  Plus,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormComponent } from "../../form/FormComponent";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import {
  FormDesigner,
  useFormDesigner,
} from "../providers/FormDesignerProvider";
import { Card } from "@/components/ui/card";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

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
    <FormDesigner config={currentConfig}>
      <div className="p-2 space-y-4 flex flex-row ">
        <FormDesignerSidebar />
        <DesignerContent />
      </div>
    </FormDesigner>
  );
}

export const DesignerContent = () => {
  const dropable = useDroppable({
    id: "designer-form-area",
  });

  const { config, formConfig, addFormElement } = useFormDesigner();

  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event;

      if (!over || !active) return;

      if (over.id !== "designer-form-area") return;

      const isDesignerButtonElement =
        active.data.current?.isDesignerButtonElement;

      if (isDesignerButtonElement) {
        const targetElement = basicFieldConfigs.find(
          (config) => config.defaultValue.type === active.data.current?.type
        );

        console.log("targetElement", targetElement);

        if (!targetElement) return;

        addFormElement(
          config.form.questions.length + 1,
          targetElement.defaultValue
        );
      }
    },
  });

  return (
    <div className="flex-1 p-4 space-y-4">
      <h1 className="text-xl font-bold">Configurations de fiche</h1>
      <div className="flex flex-row gap-4">
        <Input className="text-sm text-muted-foreground" value={config.label} />
        <FormPreview />
      </div>
      <h3 className="text-md font-semibold">Questions existantes</h3>
      <div className={cn("h-full ", dropable.isOver)} ref={dropable.setNodeRef}>
        {dropable.isOver ? (
          <div className="p-2 rounded-md bg-slate-500 opacity-10 h-24">
            <p className="text-sm text-muted-foreground">
              Dropper ici pour ajouter un nouveau champ
            </p>
          </div>
        ) : (
          <FormFieldsList form={formConfig} configId={config.id} />
        )}
      </div>
    </div>
  );
};

export const FormDesignerSidebar = () => {
  const { selectedQuestion } = useFormDesigner();

  return (
    <div className="w-[300px] h-full border-r p-2 space-y-4 flex flex-col">
      {selectedQuestion ? (
        <FormDesignerQuestionEditor />
      ) : (
        <FormDesignerSidebarList />
      )}
    </div>
  );
};

export const FormDesignerSidebarList = () => {
  const { configId } = useFormDesigner();

  return (
    <div className="p-2 space-y-4 flex flex-col ">
      <FormFieldList
        label="Basics Fields"
        configId={configId}
        fieldConfigs={basicFieldConfigs}
      />
      <FormFieldList
        label="Advanced Fields"
        configId={configId}
        fieldConfigs={advancedFieldConfigs}
      />
    </div>
  );
};

export const FormDesignerQuestionEditor = () => {
  const { selectQuestion, selectedQuestion } = useFormDesigner();
  return (
    <div className="p-2 space-y-4 flex flex-col ">
      edit config <Button onClick={() => selectQuestion(null)}>Quiiter</Button>
      {selectedQuestion && <QuestionEditFactory question={selectedQuestion} />}
    </div>
  );
};

export const FormPreview = () => {
  const [open, setOpen] = useState(false);

  const { config } = useFormDesigner();

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
          <FormComponent
            form={config.form}
            display={"column"}
            onSubmit={(form) => {
              alert(JSON.stringify(form));
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const FormFieldsList = ({
  form,
}: {
  form: FormType;
  configId: string;
}) => {
  console.log("form", form);
  return (
    <div className="pt-6">
      <ScrollArea>
        <div className="flex flex-col gap-2 pt-4">
          {form.questions.map((question) => (
            <FormQuestionWrapper key={question.name} question={question} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

function FormQuestionWrapper({ question }: { question: FormElement }) {
  const { configId, selectQuestion } = useFormDesigner();
  const [isHovered, setIsHovered] = useState(false);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: question.name,
    data: {
      type: question.type,
      isDesignerButtonElement: true,
    },
  });

  return (
    <div
      style={{ opacity: isDragging ? 0.5 : 1 }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <Card
        className="p-4 flex flex-row gap-2 cursor-pointer transition-all rounded-2xl border-2 hover:border-green-500 hover:shadow-green-200 hover:shadow-md group justify-between items-center"
        onClick={() => selectQuestion(question.name)}
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div>
          <div className="text-xs text-muted-foreground">
            <Label className="text-xs text-muted-foreground">
              {question.name}
            </Label>
            <Label className="text-xs text-muted-foreground">
              {question.label}
            </Label>
            <Input
              placeholder={question.placeholder}
              className="text-xs text-muted-foreground"
            />
          </div>
        </div>
        {isHovered && (
          <div className="absolute flex flex-col gap-2 items-center">
            <p>Deplacer pour modifier l'ordre</p>
          </div>
        )}
        {isHovered && (
          <DeleteQuestionButton
            configId={configId}
            questionId={question.name}
          />
        )}
      </Card>
    </div>
  );
}

interface DraggableItemProps {
  id: string;
  children: ReactNode;
}

function QuestionEditFactory({ question }: { question: FormElement }) {
  const Component =
    questionTypeComponentMap[question.type] || DefaultQuestionEdit;
  return (
    <div className="flex flex-col gap-4">
      <Component question={question} />
      <Button>Sauvegarder</Button>
    </div>
  );
}

const questionTypeComponentMap: Record<
  QuestionType,
  React.FC<QuestionEditProps<any>>
> = {
  string: DefaultQuestionEdit,
  number: DefaultQuestionEdit,
  boolean: DefaultQuestionEdit,
  select: SelectQuestionEdit,
  user: DefaultQuestionEdit,
};

interface QuestionEditProps<T extends FormElement = FormElement> {
  question: T;
}

function DefaultQuestionEdit({ question }: QuestionEditProps) {
  return (
    <div className="flex flex-col gap-2">
      <QuestionContainer>
        <Label>Nom techqnique</Label>
        <Input type="text" defaultValue={question.name} className="w-full" />
      </QuestionContainer>
      <QuestionContainer>
        <Label>Libélé</Label>
        <Input type="text" defaultValue={question.type} className="w-full" />
      </QuestionContainer>
      <QuestionContainer>
        <Label>Placeholder</Label>
        <Input
          type="text"
          defaultValue={question.placeholder}
          className="w-full"
        />
      </QuestionContainer>
    </div>
  );
}

function SelectQuestionEdit({ question }: QuestionEditProps<SelectQuestion>) {
  return (
    <div className="flex flex-col gap-2">
      <QuestionContainer>
        <Label>Nom techqnique</Label>
        <Input type="text" defaultValue={question.name} className="w-full" />
      </QuestionContainer>
      <QuestionContainer>
        <Label>Libélé</Label>
        <Input type="text" defaultValue={question.label} className="w-full" />
      </QuestionContainer>
      <QuestionContainer>
        <Label>Placeholder</Label>
        <Input
          type="text"
          defaultValue={question.placeholder}
          className="w-full"
        />
      </QuestionContainer>
      <div>
        <div className="flex items-center justify-between">
          Ajouter un option
          <Button variant={"ghost"}>
            <Plus />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {question.options.map((option) => (
            <div key={option.value} className="flex gap-2">
              <Input
                type="text"
                defaultValue={option.name}
                className="w-full"
              />
              <Button variant="ghost" size="icon">
                <Trash />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionContainer({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-row gap-2">{children}</div>;
}

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
      placeholder: "Oui/Non",
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
  defaultValue: FormElement;
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

  const handleAddQuestion = async (fieldConfig: FormElement) => {
    await createRecordConfigQuestion(configId, fieldConfig, {
      onQuestionRecordConfigCreated: () =>
        addQuestionToRecordConfig(configId, fieldConfig),
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">{label}</h1>
      <div className="grid grid-cols-2 gap-2">
        {fieldConfigs.map((fieldConfig) => (
          <FieldCard
            field={fieldConfig}
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
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: field.defaultValue.type,
    data: {
      type: field.defaultValue.type,
      isDesignerButtonElement: true,
    },
  });

  return (
    <div
      style={{ opacity: isDragging ? 0.5 : 1 }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={clsx(
        "p-4 flex flex-col items-center gap-4 cursor-pointer transition-all rounded-2xl",
        "border-2 hover:border-green-500 hover:shadow-green-200 hover:shadow-md group"
      )}
      onClick={onClick}
    >
      <div className="text-muted-foreground group-hover:text-green-700">
        {field.icon}
      </div>
      <div className="text-base font-medium group-hover:text-green-700">
        {field.defaultValue.label}
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
    <Button variant="ghost" onClick={handleDelete}>
      <Trash className="h-4 w-4" />
    </Button>
  );
};

export function DragOverlayWrapper({}: {}) {
  const { active } = useDroppable({
    id: "droppable",
  });
}

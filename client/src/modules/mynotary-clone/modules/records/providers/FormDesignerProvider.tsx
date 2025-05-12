import { createContext, ReactNode, useContext, useState } from "react";
import { FormElement, FormType } from "../../form/form";
import { RecordConfig, RecordFormConfig } from "../record-configs";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  rectIntersection,
} from "@dnd-kit/core";

interface FormDesignerContextValue {
  selectedQuestion: FormElement | null;
  selectQuestion: (questionId: string | null) => void;
  addFormElement: (index: number, question: FormElement) => void;
  configId: string;
  config: RecordConfig;
  formConfig: RecordFormConfig;
}

const FormDesignerContext = createContext<FormDesignerContextValue | null>(
  null
);

export const FormDesigner = ({
  children,
  config,
}: {
  children: ReactNode;
  config: RecordConfig;
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [originActiveItem, setOriginActiveItem] = useState<string | null>(null);

  const [_config, setConfig] = useState<RecordConfig>(config);
  const [formConfig, setFormConfig] = useState<RecordFormConfig>(config.form);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );

  const addFormElement = (index: number, element: FormElement) => {
    setFormConfig((prev) => {
      const newElement = [...prev.questions];
      newElement.splice(index, 0, element);
      console.log(newElement);
      return {
        ...prev,
        questions: newElement,
      };
    });
  };

  const value: FormDesignerContextValue = {
    selectedQuestion:
      formConfig.questions.find(
        (question) => question.name === selectedQuestionId
      ) || null,
    selectQuestion: (questionId: string | null) => {
      setSelectedQuestionId(questionId);
    },
    configId: config.id,
    config: _config,
    formConfig,
    addFormElement,
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      setActiveItem(null);
      setOriginActiveItem(null);
      return;
    }

    if (over.id === "EMPTY_FOLDER_AREA") {
      // move
    } else {
      // move
    }
    setActiveItem(null);
    setOriginActiveItem(null);
  };

  const handleDragStart = ({ active }: DragEndEvent) => {
    setActiveItem(active.id.toString());
    setOriginActiveItem(null);
  };

  const handleDragOver = ({ active, over }: DragEndEvent) => {
    console.log(active.id);
    console.log(over?.id);
  };

  const handleDragCancel = ({}: DragEndEvent) => {
    setActiveItem(null);
    setOriginActiveItem(null);
  };

  return (
    <FormDesignerContext.Provider value={value}>
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
        collisionDetection={rectIntersection}
      >
        {children}
        <DragOverlay>{activeItem != null ? <div>test</div> : null}</DragOverlay>
      </DndContext>
    </FormDesignerContext.Provider>
  );
};

export const useFormDesigner = () => {
  const context = useContext(FormDesignerContext);
  if (!context) {
    throw new Error(
      "useRecordConfig must be used within a RecordConfigProvider"
    );
  }
  return context;
};

import { Document } from "./Document";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  rectIntersection,
} from "@dnd-kit/core";
import { ReactNode, useState } from "react";
import { useMoveDocument } from "../providers/DriveDocumentProvider";

export const EMPTY_FOLDER_AREA = "empty-folder-area";

interface DriveProps {
  children: ReactNode;
}

export const DriveDndContext = ({ children }: DriveProps) => {
  const moveDocument = useMoveDocument();

  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [originActiveItem, setOriginActiveItem] = useState<string | null>(null);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      setActiveItem(null);
      setOriginActiveItem(null);
      return;
    }

    if (over.id === EMPTY_FOLDER_AREA) {
      moveDocument({ documentId: active.id.toString(), folderId: null });
    } else {
      moveDocument({
        documentId: active.id.toString(),
        folderId: over.id.toString(),
      });
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
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      collisionDetection={rectIntersection}
    >
      {children}
      <DragOverlay>
        {activeItem != null ? <Document documentId={activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

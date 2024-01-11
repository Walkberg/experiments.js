import { ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableItemProps {
  id: string;
  children: ReactNode;
}

export const DraggableItem = ({ id, children }: DraggableItemProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });

  return (
    <div
      style={{ opacity: isDragging ? 0.5 : 1 }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

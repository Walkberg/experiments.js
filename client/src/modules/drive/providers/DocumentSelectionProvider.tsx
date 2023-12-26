import { ReactNode, createContext, useContext, useState } from "react";

interface DocumentsSelectionContextType {
  isSelectable: boolean;
  selectItem: (id: string) => void;
  isActive: (id: string) => boolean;
  toogleSelectable: () => void;
}

const DocumentsSelectionContext =
  createContext<DocumentsSelectionContextType | null>(null);

interface DocumentsSelectionProps {
  children: ReactNode;
}

export const DocumentsSelectionProvider = ({
  children,
}: DocumentsSelectionProps) => {
  const [isSelectable, setIsSelectable] = useState(true);

  const [items, setItems] = useState<string[]>([]);

  const isActive = (id: string) => {
    return items.find((item) => item === id) != null;
  };

  const toogleSelectable = () => {
    setIsSelectable((prev) => !prev);
  };

  const selectItem = (id: string) => {
    console.log(id);
    setItems((prev) => {
      if (prev.find((item) => item === id) == null) {
        return [...prev, id];
      } else {
        return prev.filter((i) => i !== id);
      }
    });
  };

  return (
    <DocumentsSelectionContext.Provider
      value={{ isSelectable, selectItem, isActive, toogleSelectable }}
    >
      {children}
    </DocumentsSelectionContext.Provider>
  );
};

export function useSelection() {
  const context = useContext(DocumentsSelectionContext);

  if (context == null) {
    throw new Error();
  }

  return context;
}

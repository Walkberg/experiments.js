import { Checkbox } from "@/components/ui/checkbox";
import { useSelection } from "../providers/DocumentSelectionProvider";

interface DocumentSelectionProps {
  documentId: string;
}

export const DocumentSelection = ({ documentId }: DocumentSelectionProps) => {
  const { isSelectable, isActive, selectItem } = useSelection();

  if (!isSelectable) {
    return null;
  }

  return (
    <Checkbox
      checked={isActive(documentId)}
      onClick={() => selectItem(documentId)}
    />
  );
};

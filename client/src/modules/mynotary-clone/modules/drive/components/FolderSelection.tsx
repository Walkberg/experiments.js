import { Checkbox } from "@/components/ui/checkbox";
import { useSelection } from "../providers/DocumentSelectionProvider";
import { useDocuments } from "../providers/DriveDocumentProvider";

interface FolderSelectionProps {
  folderId: string;
}

export const FolderSelection = ({ folderId }: FolderSelectionProps) => {
  const documents = useDocuments();
  const { isSelectable, isActive, selectItem } = useSelection();

  if (!isSelectable) {
    return null;
  }

  const filteredDocuments = documents.filter((a) => a.folderId === folderId);

  const isAllActive =
    filteredDocuments.filter((doc) => {
      isActive(doc.id);
    }).length === filteredDocuments.length && filteredDocuments.length !== 0;

  const selectAllItems = () => {
    for (const document of filteredDocuments) {
      selectItem(document.id);
    }
  };

  return <Checkbox checked={isAllActive} onClick={selectAllItems} />;
};

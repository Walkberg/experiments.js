import { DriveDocument } from "../drive";
import { useDocuments } from "../providers/DriveDocumentProvider";
import { useSearch } from "../providers/DriveSearchProvider";

import { DocumentProps } from "./Document";
import { DocumentEmpty } from "./DocumentEmpty";

interface DocumentsProps {
  folderId?: string;
  filtered: boolean;
  DocumentComponent: React.ComponentType<DocumentProps>;
}

export const Documents = ({
  folderId,
  filtered,
  DocumentComponent,
}: DocumentsProps) => {
  const documents = useDocuments();

  const { search } = useSearch();

  const filteredDocuments = documents.filter(filteredByFolderId(folderId));

  const filteredDocumentsBySearch = filteredDocuments.filter(
    filteredBySearch(search, filtered)
  );

  if (filteredDocumentsBySearch.length === 0) {
    return <DocumentEmpty />;
  }

  return (
    <div className="flex flex-col gap-1">
      {filteredDocumentsBySearch.map((document) => (
        <DocumentComponent key={document.id} documentId={document.id} />
      ))}
    </div>
  );
};

const filteredByFolderId = (folderId?: string) => (document: DriveDocument) => {
  if (folderId == null && document.folderId == null) {
    return true;
  }

  return document.folderId == folderId;
};

const filteredBySearch =
  (search: string, filtered: boolean) => (document: DriveDocument) => {
    if (search.trim() === "" || filtered) {
      return true;
    }

    return document.filename.toLowerCase().includes(search.toLowerCase());
  };

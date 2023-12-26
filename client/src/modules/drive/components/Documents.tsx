import { DriveDocument } from "../drive";
import { useDocuments } from "../providers/DriveProvider";
import { Document } from "./Document";
import { DocumentEmpty } from "./DocumentEmpty";

interface DocumentsProps {
  folderId?: string;
}

export const Documents = ({ folderId }: DocumentsProps) => {
  const documents = useDocuments();

  const filteredDocuments = documents.filter((document) =>
    filteredByFolderId(document, folderId)
  );

  if (filteredDocuments.length === 0) {
    return <DocumentEmpty />;
  }

  return (
    <div className="flex flex-col gap-1">
      {filteredDocuments.map((document) => (
        <Document documentId={document.id} />
      ))}
    </div>
  );
};

const filteredByFolderId = (document: DriveDocument, folderId?: string) => {
  if (folderId == null && document.folderId == null) {
    return true;
  }

  return document.folderId == folderId;
};

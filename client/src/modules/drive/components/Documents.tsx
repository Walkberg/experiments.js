import { useDocuments } from "../providers/DriveProvider";
import { Document } from "./Document";

interface DocumentsProps {}

export const Documents = ({}: DocumentsProps) => {
  const documents = useDocuments();

  return (
    <div className="flex flex-col gap-1">
      {documents.map((document) => (
        <Document documentId={document.id} />
      ))}
    </div>
  );
};

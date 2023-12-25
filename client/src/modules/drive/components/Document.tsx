import { Card } from "@/components/ui/card";
import { useDocument } from "../providers/DriveProvider";

interface DocumentProps {
  documentId: string;
}

export const Document = ({ documentId }: DocumentProps) => {
  const document = useDocument(documentId);

  if (document == null) {
    return null;
  }

  return <Card className="p-2">{document.name}</Card>;
};

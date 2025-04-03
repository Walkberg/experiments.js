import { Card } from "@/components/ui/card";
import { useRef } from "react";
import { useHover } from "@/app/hooks/useHover";
import { useSearch } from "../providers/DriveSearchProvider";
import { DocumentSelection } from "./DocumentSelection";
import { useDocument } from "../providers/DriveDocumentProvider";

export interface DocumentProps {
  documentId: string;
}

export const BasicDocument = ({ documentId }: DocumentProps) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  const document = useDocument(documentId);

  if (document == null) {
    return null;
  }

  const handleClickDocument = () => {};

  return (
    <Card onClick={handleClickDocument} className="cursor-pointer" ref={ref}>
      <div className=" flex flex-row p-4 items-center  gap-4">
        <DocumentSelection documentId={documentId} />
        <div className="flex flex-col">
          <div>{document.filename}</div>
        </div>
      </div>
    </Card>
  );
};

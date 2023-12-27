import { Card } from "@/components/ui/card";
import { useDocument } from "../providers/DriveProvider";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { useHover } from "@/app/hooks/useHover";
import { useSearch } from "../providers/DriveSearchProvider";
import { DocumentSelection } from "./DocumentSelection";

export interface DocumentProps {
  documentId: string;
}

export const BasicDocument = ({ documentId }: DocumentProps) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  const document = useDocument(documentId);

  const { search } = useSearch();

  if (document == null) {
    return null;
  }

  if (!document.filename.includes(search)) {
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

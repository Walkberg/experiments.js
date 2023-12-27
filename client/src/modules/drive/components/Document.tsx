import { Card } from "@/components/ui/card";
import { useDocument } from "../providers/DriveProvider";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { useHover } from "@/app/hooks/useHover";
import { useSearch } from "../providers/DriveSearchProvider";
import { DocumentActions } from "./DocumentActions";
import { DocumentSelection } from "./DocumentSelection";

interface DocumentProps {
  documentId: string;
}

export const Document = ({ documentId }: DocumentProps) => {
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
      <div className=" flex flex-row p-4 items-center grow">
        {isHovered && (
          <Button className="relative" variant="ghost" size="sm">
            <GripVertical className="h-4 w-4" />
          </Button>
        )}
        <div className="flex flex-row justify-between items-center gap-4">
          <DocumentSelection documentId={documentId} />
          <div className="flex flex-col">
            <div>{document.filename}</div>
            <div>{convertSizeToMb(document.size)}</div>
          </div>
          <DocumentActions documentId={documentId} />
        </div>
      </div>
    </Card>
  );
};

export const convertSizeToMb = (byteSize: number) => {
  return `${byteSize / 10000024} Mo`;
};

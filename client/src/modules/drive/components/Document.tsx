import { Card } from "@/components/ui/card";
import { useDocument } from "../providers/DriveProvider";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { useHover } from "@/app/hooks/useHover";

interface DocumentProps {
  documentId: string;
}

export const Document = ({ documentId }: DocumentProps) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  const document = useDocument(documentId);

  if (document == null) {
    return null;
  }

  return (
    <Card ref={ref}>
      <div className=" flex flex-row p-4 items-center">
        {isHovered && (
          <Button className="relative" variant="ghost" size="sm">
            <GripVertical className="h-4 w-4" />
          </Button>
        )}
        <div className="flex flex-col">
          <div>{document.name}</div>
          <div>{convertSizeToMb(document.size)}</div>
        </div>
      </div>
    </Card>
  );
};

export const convertSizeToMb = (byteSize: number) => {
  return `${byteSize / 10000024} Mo`;
};

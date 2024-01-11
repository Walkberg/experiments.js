import { Card } from "@/components/ui/card";

import { useRef } from "react";
import { useHover } from "@/app/hooks/useHover";
import { useSearch } from "../providers/DriveSearchProvider";
import { DocumentActions } from "./DocumentActions";
import { DocumentSelection } from "./DocumentSelection";
import { Handle } from "./Handle";
import { DocumentAnnexedIn } from "./DocumentAnnexedIn";
import { DocumentContractIn } from "./DocumentContractIn";
import { DraggableItem } from "./DraggableItem";
import { useDocument } from "../providers/DriveDocumentProvider";

export interface DocumentProps {
  documentId: string;
}

export const Document = ({ documentId }: DocumentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useHover(ref);

  const document = useDocument(documentId);
  const { search } = useSearch();

  if (document == null || !document.filename.includes(search)) {
    return null;
  }

  const handleClickDocument = () => {};

  return (
    <DraggableItem id={documentId}>
      <Card
        onClick={handleClickDocument}
        className="relative cursor-pointer grid grid-cols-4  border-l-4"
        ref={ref}
      >
        <div className="flex flex-row m-2 items-center gap-2 ">
          {isHovered && <Handle />}
          <div className="flex flex-row items-center gap-4">
            <DocumentSelection documentId={documentId} />
            <div className="flex flex-col items-center">
              <div>{document.filename}</div>
              <div>{convertSizeToMb(document.size)}</div>
            </div>
          </div>
        </div>
        <div>
          <DocumentAnnexedIn documentId={documentId} />
        </div>
        <div>
          <DocumentContractIn documentId={documentId} />
        </div>
        <div>
          <DocumentActions documentId={documentId} />
        </div>
      </Card>
    </DraggableItem>
  );
};

export const convertSizeToMb = (byteSize: number) => {
  return `${byteSize / 1000000} Mo`;
};

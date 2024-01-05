import { Badge } from "@/components/ui/badge";
import { useDocument } from "../providers/DriveProvider";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

interface DocumentAnnexedInProps {
  documentId: string;
}

export function DocumentAnnexedIn({ documentId }: DocumentAnnexedInProps) {
  const document = useDocument(documentId);

  const fileRecords = ["test", "test", "fdjngk"];

  if (fileRecords.length === 0) {
    return null;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant={"ghost"}>
          <Badge>{fileRecords}</Badge>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {fileRecords.map((record) => (
          <div>{record}</div>
        ))}
      </HoverCardContent>
    </HoverCard>
  );
}

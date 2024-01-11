import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDocument } from "../providers/DriveDocumentProvider";

interface DocumentContractInProps {
  documentId: string;
}

export function DocumentContractIn({ documentId }: DocumentContractInProps) {
  const document = useDocument(documentId);

  const contracts = ["test", "test", "fdjngk"];

  if (contracts.length === 0) {
    return null;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant={"ghost"}>
          <Badge>{contracts.length} contrats</Badge>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {contracts.map((contract) => (
          <div>{contract}</div>
        ))}
      </HoverCardContent>
    </HoverCard>
  );
}

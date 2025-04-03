import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDocument } from "../providers/DriveDocumentProvider";
import { Link } from "react-router-dom";

interface DocumentContractInProps {
  documentId: string;
}

export function DocumentContractIn({ documentId }: DocumentContractInProps) {
  const document = useDocument(documentId);

  const contracts = [
    { id: "contract-1", name: "contract-1" },
    { id: "contract-2", name: "contract-2" },
    { id: "contract-3", name: "contract-3" },
  ];

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
          <Link to={""}>
            <div className="flex">{contract.name}</div>
          </Link>
        ))}
      </HoverCardContent>
    </HoverCard>
  );
}

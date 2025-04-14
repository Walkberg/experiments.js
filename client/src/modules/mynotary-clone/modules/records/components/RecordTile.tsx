import { Card, CardContent } from "@/components/ui/card";
import { Recorde } from "../record";

interface RecordTileProps {
  record: Recorde;
  onClick?: (recordId: string) => void;
}

export function RecordTile({ record, onClick }: RecordTileProps) {
  return (
    <Card
      className="p-4 space-y-1 cursor-pointer"
      onClick={() => onClick?.(record.id)}
    >
      <div className="text-sm text-muted-foreground">ID: {record.id}</div>
      <div className="font-medium">{record.type}</div>
      <div className="text-xs text-muted-foreground">
        Organisation: {record.organizationId}
      </div>
      <div className="text-xs">Créé par: {record.creatorId}</div>
    </Card>
  );
}

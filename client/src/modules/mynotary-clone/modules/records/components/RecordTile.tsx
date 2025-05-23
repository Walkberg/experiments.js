import { Card } from "@/components/ui/card";
import { Recorde } from "../record";
import { RecordDelete } from "../pages/LegalRecordPage";

interface RecordTileProps {
  record: Recorde;
  onClick?: (recordId: string) => void;
}

export function RecordTile({ record, onClick }: RecordTileProps) {
  return (
    <Card
      className="p-4 space-y-1 cursor-pointer flex justify-between"
      onClick={() => onClick?.(record.id)}
    >
      <div>
        <div className="text-sm text-muted-foreground">ID: {record.id}</div>
        <div className="font-medium">{record.type}</div>
        <div className="text-xs text-muted-foreground">
          Organisation: {record.organizationId}
        </div>
        <div className="text-xs">Créé par: {record.creatorId}</div>
      </div>
      <RecordDelete record={record} />
    </Card>
  );
}

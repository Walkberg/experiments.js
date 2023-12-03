import { Card, CardContent } from "@/components/ui/card";
import { Recorde } from "../record";

interface RecordTileProps {
  record: Recorde;
  onClick?: (recordId: string) => void;
}

export const RecordTile = ({ record, onClick }: RecordTileProps) => {
  return (
    <Card className='flex cursor-pointer' onClick={() => onClick?.(record.id)} >
      <CardContent>RecordTile {record.id}</CardContent>
    </Card>
  );
};

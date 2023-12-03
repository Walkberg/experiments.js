import { Input } from "@/components/ui/input";
import { RecordCreationProps, createRandomRecordNew } from "../record";
import { Button } from "@/components/ui/button";
import { RecordApiImpl } from "../record.api";

const recordApi = new RecordApiImpl();

export const RecordCreate = ({ onValidate }: RecordCreationProps) => {
  const handleInitCreateRecord = async () => {
    // move in hhok
    try {
      const record = await recordApi.createRecord(createRandomRecordNew());
      onValidate(record.id);
    } catch (e) {
      // handle error
    }
  };

  return (
    <div className="flex items-center space-x-2 columns-1">
      <Input autoFocus type="email" placeholder="Email" />
      <Button onClick={handleInitCreateRecord}>Creer</Button>
    </div>
  );
};

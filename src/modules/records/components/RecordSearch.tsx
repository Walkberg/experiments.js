import { Input } from "@/components/ui/input";
import { RecordTile } from "./RecordTile";
import { RecordCreationProps, Recorde } from "../record";
import { useEffect, useState } from "react";
import { RecordApiImpl } from "../record.api";

const recordApi = new RecordApiImpl();

export const RecordSearch = ({ onValidate }: RecordCreationProps) => {
  const [search, setSearch] = useState("");

  const [records, setRecords] = useState<Recorde[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      if (search.length > 0) {
        try {
          const records = await recordApi.getRecords({ search });
          setRecords(records);
        } catch (e) {}
      }
    };
    // set in hook
    fetchRecords();
  }, [search]);

  const handleInitSearchRecord = () => {
    // do server logic
    onValidate("record-1");
  };

  return (
    <div className="flex items-center space-x-2   flex-col">
      <div className="flex flex-row">
        <Input
          autoFocus
          type="email"
          placeholder="Chercher"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2  flex-col">
        {records.map((record) => (
          <RecordTile record={record} onClick={handleInitSearchRecord} />
        ))}
      </div>
    </div>
  );
};

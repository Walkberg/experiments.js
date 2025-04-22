import { RecordCreationProps, Recorde, RecordNew } from "../record";
import { Button } from "@/components/ui/button";
import { useRecords } from "../providers/RecordPersistenceProvider";
import { FormType, FormValues } from "../../form/form";
import { useRecordCreation } from "../pages/LegalRecordPage";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FormComponent } from "../../form/FormComponent";
import { useCurrentMember } from "../../members/pages/MembersPage";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useRecordConfigs } from "../providers/RecordConfigProvider";
import { useFetchRecordConfigs } from "../pages/RecordConfigPage";
import { useKey } from "@/modules/mynotary-clone/hooks/useKey";

interface RecordCreateProps extends RecordCreationProps {
  trigger?: React.ReactNode;
}

export const RecordCreate = ({ onValidate, trigger }: RecordCreateProps) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>("");

  const { userId, organizationId } = useCurrentMember();
  const { addRecord } = useRecords();
  const { createRecord } = useRecordCreation();

  const { fetchRecordConfigs } = useFetchRecordConfigs();
  const { recordConfigs, setRecordConfigs } = useRecordConfigs();

  useKey(["a"], () => setOpen(true));

  useEffect(() => {
    fetchRecordConfigs({
      onRecordConfigsFetched: setRecordConfigs,
    });
  }, []);

  const handleRecordCreated = (record: Recorde) => {
    addRecord(record);
    setOpen(false);
  };

  const handleSubmit = async (formResponse: FormValues<FormType>) => {
    const recordNew: RecordNew = {
      type: type,
      answers: formResponse,
      creatorId: userId,
      organizationId: organizationId,
    };
    createRecord(recordNew, {
      onRecordCreated: handleRecordCreated,
    });
  };

  const form = recordConfigs.find((config) => config.id === type)?.form;

  return (
    <div className="flex items-center space-x-2 columns-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger ?? <Button>Créer une fiche</Button>}
        </DialogTrigger>
        <DialogContent>
          <Select onValueChange={setType}>
            <label htmlFor={"name"}>{"type"}</label>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={"placeholder"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {recordConfigs
                  .filter((value) => value.type === "person")
                  .map((option) => (
                    <SelectItem value={option.id}>{option.label}</SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {form && (
            <FormComponent
              key={type}
              onSubmit={handleSubmit}
              display={"column"}
              form={form}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

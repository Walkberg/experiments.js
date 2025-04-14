import { RecordCreationProps, RecordNew } from "../record";
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
import { useState } from "react";
import { useRecordConfigs } from "../providers/RecordConfigProvider";

export const RecordCreate = ({ onValidate }: RecordCreationProps) => {
  const { userId, organizationId } = useCurrentMember();
  const { addRecord } = useRecords();
  const { createRecord } = useRecordCreation();
  const { recordConfigs } = useRecordConfigs();

  const [type, setType] = useState<string>("");

  const handleSubmit = async (formResponse: FormValues<FormType>) => {
    const recordNew: RecordNew = {
      type: type,
      answers: formResponse,
      creatorId: userId,
      organizationId: organizationId,
    };
    console.log(recordNew);
    createRecord(recordNew, {
      onRecordCreated: addRecord,
    });
  };

  const form = recordConfigs[type]?.form;

  return (
    <div className="flex items-center space-x-2 columns-1">
      <Dialog>
        <DialogTrigger>
          <Button>Créer un Record</Button>
        </DialogTrigger>
        <DialogContent>
          <Select onValueChange={setType}>
            <label htmlFor={"name"}>{"type"}</label>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={"placeholder"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(recordConfigs)
                  .filter(([__key, value]) => value.type === "person")
                  .map(([key, option]) => (
                    <SelectItem value={key}>{option.type}</SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {form && (
            <FormComponent
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

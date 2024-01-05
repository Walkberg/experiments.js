import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePermission } from "@/modules/user-permissions/use-permission";
import { ChangeEvent, useState } from "react";
import { useCreateContract } from "../providers/ContractProvider";

interface ContractAddProps {
  operationId: string;
}

export const ContractAdd = ({ operationId }: ContractAddProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const canCreate = usePermission("contract", "create");
  const createContract = useCreateContract();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createContract({ name, operationId });
    setName("");
    setOpen(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!canCreate}>Crree un contract</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            autoFocus
            placeholder="nom"
            onChange={handleInputChange}
            value={name}
          />
          <Button disabled={name.length === 0} type="submit">
            Creer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

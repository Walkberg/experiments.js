import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePermission } from "@/modules/mynotary-clone/modules/user-permissions/use-permission";
import { ChangeEvent, useEffect, useState } from "react";
import { useCreateContract } from "../providers/ContractProvider";
import { useContractClient } from "../providers/ContractClientProvider";
import { Contract, ContractNew } from "../contract";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContractsConfigs } from "@/modules/mynotary-clone/modules/operations/providers/OperationConfigsProvider";
import { useKey } from "@/modules/mynotary-clone/hooks/useKey";

interface ContractAddProps {
  operationId: string;
}

export const ContractAdd = ({ operationId }: ContractAddProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");

  const canCreate = usePermission("contract", "create");

  const { getContractsConfigs } = useContractsConfigs();

  const addContract = useCreateContract();

  const [status, createContract] = useContractCreation();

  useKey(["a"], () => setOpen((open) => !open));

  const handleContractCreated = async (contract: Contract) => {
    addContract(contract);
    setName("");
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createContract(
      { name, operationId, templateId: type },
      {
        onContractCreated: handleContractCreated,
      }
    );
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
          <Select onValueChange={setType}>
            <label htmlFor={name}>{"type"}</label>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={"placeholder"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {getContractsConfigs().map((option) => (
                  <SelectItem value={option.id}>{option.type}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            autoFocus
            placeholder="nom"
            onChange={handleInputChange}
            value={name}
            disabled={!canCreate || status === "creating"}
          />
          <Button disabled={name.length === 0} type="submit">
            Creer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ContractCreationOptions {
  onContractCreate?: () => Promise<void>;
  onContractCreated?: (contract: Contract) => Promise<void>;
  onContractCreationFailed?: () => Promise<void>;
}

type UseContractCreation = [
  Status,
  (contractNew: ContractNew, options: ContractCreationOptions) => Promise<void>
];

type Status = "idle" | "creating" | "success" | "error";

function useContractCreation(): UseContractCreation {
  const contractClient = useContractClient();
  const [status, setStatus] = useState<Status>("idle");

  async function createContract(
    contractNew: ContractNew,
    {
      onContractCreate,
      onContractCreated,
      onContractCreationFailed,
    }: ContractCreationOptions
  ) {
    await onContractCreate?.();
    try {
      setStatus("creating");
      const contractCreated = await contractClient.createContract(contractNew);
      await onContractCreated?.(contractCreated);
      setStatus("success");
    } catch (e) {
      console.log(e);
      await onContractCreationFailed?.();
      setStatus("error");
    }
  }

  return [status, createContract];
}

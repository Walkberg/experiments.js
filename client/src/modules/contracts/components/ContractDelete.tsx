import { Button } from "@/components/ui/button";
import { usePermission } from "@/modules/user-permissions/use-permission";
import { Trash } from "lucide-react";

interface ContractDeleteProps {
  contractId: string;
}

export const ContractDelete = ({ contractId }: ContractDeleteProps) => {
  const canDelete = usePermission("contract", "delete");

  return (
    <Button disabled={!canDelete} variant={"ghost"}>
      <Trash />
    </Button>
  );
};

import { Card } from "@/components/ui/card";
import { Contract } from "../contract";
import { ContractDelete } from "./ContractDelete";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

interface ContractTileProps {
  contract: Contract;
}

export const ContractTile = ({ contract }: ContractTileProps) => {
  const navigate = useNavigate();

  const handleClickContract = () => {
    navigate(`./${contract.id}`);
  };

  return (
    <Button
      onClick={handleClickContract}
      className="cursor-pointer"
      asChild
      variant={"ghost"}
    >
      <Card className="flex flex-row items-center justify-between p-4">
        <div>
          Contract tiel{contract.id} {contract.name}
        </div>
        <div>type: {contract.templateId}</div>
        <ContractDelete contractId={contract.id} />
      </Card>
    </Button>
  );
};

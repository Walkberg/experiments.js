import { Card } from "@/components/ui/card";
import { Contract } from "../contract";

interface ContractTileProps {
  contract: Contract;
}

export const ContractTile = ({ contract }: ContractTileProps) => {
  return (
    <Card className="p-4">
      Contract tiel{contract.id} {contract.name}
    </Card>
  );
};

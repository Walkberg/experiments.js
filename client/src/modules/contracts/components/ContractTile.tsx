import { Card } from "@/components/ui/card";
import { Contract } from "../contract";

interface ContractTileProps {
  contract: Contract;
}

export const ContractTile = ({ contract }: ContractTileProps) => {
  return <Card>Contract tiel{contract.id}</Card>;
};

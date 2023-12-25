import { Contract } from "../contract";
import { ContractTile } from "./ContractTile";

interface ContractListProps {
  contracts: Contract[];
}

export const ContractList = ({ contracts }: ContractListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {contracts.map((contract) => (
        <ContractTile contract={contract} />
      ))}
    </div>
  );
};

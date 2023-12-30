import { useContracts } from "../providers/ContractProvider";
import { ContractTile } from "./ContractTile";

interface ContractListProps {}

export const ContractList = ({}: ContractListProps) => {
  const { contracts } = useContracts();
  return (
    <div className="flex flex-col gap-4">
      {contracts.map((contract) => (
        <ContractTile contract={contract} />
      ))}
    </div>
  );
};

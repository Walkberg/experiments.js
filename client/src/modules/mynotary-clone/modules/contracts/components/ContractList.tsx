import { usePermission } from "@/modules/user-permissions/use-permission";
import { useContracts } from "../providers/ContractProvider";
import { ContractTile } from "./ContractTile";

interface ContractListProps {}

export const ContractList = ({}: ContractListProps) => {
  const canRead = usePermission("contract", "read");

  const { contracts } = useContracts();

  if (!canRead) {
    return <div>no permisson</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {contracts.map((contract) => (
        <ContractTile contract={contract} />
      ))}
    </div>
  );
};

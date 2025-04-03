import { ContractProvider } from "@/modules/mynotary-clone/modules/contracts/providers/ContractProvider";
import { Outlet } from "react-router";

export const OperationWrapper = () => {
  return (
    <div>
      <ContractProvider operationId={"1"}>
        <Outlet />
      </ContractProvider>
    </div>
  );
};

import { ContractProvider } from "@/modules/mynotary-clone/modules/contracts/providers/ContractProvider";
import { Outlet, useParams } from "react-router";

export const OperationWrapper = () => {
  const { operationId } = useParams();

  if (operationId == null) {
    return <div>error</div>;
  }
  return (
    <div>
      <ContractProvider operationId={operationId}>
        <Outlet />
      </ContractProvider>
    </div>
  );
};

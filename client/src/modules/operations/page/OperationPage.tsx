import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useNavigate, useParams } from "react-router";
import {
  OperationProvider,
  useOperation,
} from "../providers/OperationProvider";

export const OperationPage = () => {
  let { operationId } = useParams();

  if (operationId == null) {
    throw new Error();
  }

  return (
    <div className="flex flex-grow flex-col gap-2">
      <OperationProvider operationId={operationId}>
        <OperationDetail />
      </OperationProvider>
      <Outlet />
    </div>
  );
};

export function OperationDetail() {
  const { operation, status } = useOperation();

  if (operation == null || status === "fetching") {
    return <div>...loading</div>;
  }

  return (
    <div>
      <OperationInformation />
      <OperationNavigation />
    </div>
  );
}

export function OperationInformation() {
  return <Card className="p-2 mt-2 mb-2">name</Card>;
}

export function OperationNavigation() {
  const navigate = useNavigate();

  return (
    <Tabs defaultValue="account">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger onClick={() => navigate("contracts")} value="account">
          Contract
        </TabsTrigger>
        <TabsTrigger onClick={() => navigate("drive")} value="password">
          Drive
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

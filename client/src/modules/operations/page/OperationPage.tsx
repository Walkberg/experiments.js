import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Outlet, useNavigate } from "react-router";

export const OperationPage = () => {
  return (
    <div className="flex flex-col gap-2">
      <OperationInformation />
      <OperationNavigation />
      <Outlet />
    </div>
  );
};

export function OperationInformation() {
  return <Card>name</Card>;
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

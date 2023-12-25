import { Button } from "@/components/ui/button";
import { ContractPage } from "@/modules/contracts/page/ContractPage";
import { DrivePage } from "@/modules/drive/page/DrivePage";
import { OperationPage } from "@/modules/operations/page/OperationPage";
import { RedactionPage } from "@/modules/redaction/page/RedactionPage";
import { Outlet, Route, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Test />}>
      <Route path="dashboard" element={<Cool />} />
      <Route path="mynotary">
        <Route path="redaction" element={<RedactionPage />} />
        <Route path="operation/:id" element={<OperationPage />}>
          <Route path="contracts" element={<ContractPage />} />
          <Route path="drive" element={<DrivePage />} />
        </Route>
      </Route>
    </Route>
  )
);

function Test() {
  return (
    <>
      <Outlet />
    </>
  );
}

function Cool() {
  return (
    <>
      cool
      <Button>Bonjour</Button>
    </>
  );
}

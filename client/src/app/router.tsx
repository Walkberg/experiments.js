import { Button } from "@/components/ui/button";
import { BalatroPage, BalatroTest } from "@/modules/balatro/BalatroPage";
import { BattlegroundPage } from "@/modules/battleground/battleground-page";
import { CardGamePage } from "@/modules/card-game/CardGamePage";
import { CommandPatternPage } from "@/modules/command-pattern/CommandPattern";
import { ContractPage } from "@/modules/mynotary-clone/modules/contracts/page/ContractPage";
import { DrivePage } from "@/modules/mynotary-clone/modules/drive/page/DrivePage";
import { FormPage } from "@/modules/mynotary-clone/modules/form/FormPage";
import {
  ConfigManager,
  ContractConfigClientProvider,
} from "@/modules/mynotary-clone/modules/operations/components/OperationConfigManager";
import { OperationWrapper } from "@/modules/mynotary-clone/modules/operations/components/OperationWrapper";
import { OperationPage } from "@/modules/mynotary-clone/modules/operations/page/OperationPage";
import { OperationConfigsProvider } from "@/modules/mynotary-clone/modules/operations/providers/OperationConfigsProvider";
import { PageTemplate } from "@/modules/page-template/PageTemplate";
import { RedactionPage } from "@/modules/mynotary-clone/modules/redaction/page/RedactionPage";
import { Outlet, Route, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { OperationsPage } from "@/modules/mynotary-clone/modules/operations/page/OperationsPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Test />}>
      <Route path="command-pattern" element={<CommandPatternPage />} />
      <Route path="balatro" element={<BalatroPage />} />
      <Route path="balatro-test" element={<BalatroTest />} />
      <Route path="battleground" element={<BattlegroundPage />} />
      <Route path="form" element={<FormPage />} />
      <Route path="dashboard" element={<Cool />} />
      <Route
        path="mynotary"
        element={
          <ContractConfigClientProvider>
            <OperationConfigsProvider>
              <PageTemplate />
            </OperationConfigsProvider>
          </ContractConfigClientProvider>
        }
      >
        <Route path="operations" element={<OperationsPage />}></Route>
        <Route path="configs" element={<ConfigManager />} />
        <Route element={<OperationWrapper />}>
          <Route path="operations/:operationId">
            <Route element={<OperationPage />}>
              <Route path="contracts" element={<ContractPage />} />
              <Route path="drive" element={<DrivePage />} />
            </Route>
            <Route path="contracts/:contractId" element={<RedactionPage />} />
          </Route>
        </Route>
        <Route path="programme/:programeId" element={<OperationPage />}>
          <Route path="ventes" element={<ContractPage />} />
          <Route path="contracts/:contractId" element={<RedactionPage />} />
          <Route path="drive" element={<DrivePage />} />
        </Route>
      </Route>
      <Route path="mygame" element={<CardGamePage />} />
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

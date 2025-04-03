import { Button } from "@/components/ui/button";
import { BalatroPage, BalatroTest } from "@/modules/balatro/BalatroPage";
import { BattlegroundPage } from "@/modules/battleground/battleground-page";
import { CardGamePage } from "@/modules/card-game/CardGamePage";
import { CommandPatternPage } from "@/modules/command-pattern/CommandPattern";
import { ContractPage } from "@/modules/mynotary-clone/modules/contracts/page/ContractPage";
import { DrivePage } from "@/modules/drive/page/DrivePage";
import { FormPage } from "@/modules/form/FormPage";
import {
  ConfigManager,
  ContractConfigClientProvider,
} from "@/modules/operations/components/OPerationConfigManager";
import { OperationWrapper } from "@/modules/operations/components/OperationWrapper";
import { OperationPage } from "@/modules/operations/page/OperationPage";
import { OperationConfigsProvider } from "@/modules/operations/providers/OperationConfigsProvider";
import { PageTemplate } from "@/modules/page-template/PageTemplate";
import { RedactionPage } from "@/modules/redaction/page/RedactionPage";
import { Outlet, Route, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";

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
        <Route element={<OperationWrapper />}>
          <Route path="configs" element={<ConfigManager />} />
          <Route path="operation/:operationId">
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

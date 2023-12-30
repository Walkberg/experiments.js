import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { DriveClientProvider } from "./modules/drive/providers/DriveClientProvider";
import { ThemeProvider } from "./app/theme/ThemeProvider";
import { UserProvider } from "./modules/user/providers/UserProvider";
import { UserClientProvider } from "./modules/user/providers/UserClientProvider";
import { NotificationClientProvider } from "./modules/notification/providers/NotificationClientProvider";
import { NotificationProvider } from "./modules/notification/providers/NotificationProvider";
import { OperationClientProvider } from "./modules/operations/providers/OperationClientProvider";
import { ContractClientProvider } from "./modules/contracts/providers/ContractClientProvider";
import { FakeContractClient } from "./modules/contracts/in-memory-contract.client";

function App() {
  return (
    <ThemeProvider>
      <OperationClientProvider>
        <ContractClientProvider contractClient={new FakeContractClient()}>
          <NotificationClientProvider>
            <UserClientProvider>
              <DriveClientProvider>
                <NotificationProvider>
                  <UserProvider>
                    <RouterProvider router={router} />
                  </UserProvider>
                </NotificationProvider>
              </DriveClientProvider>
            </UserClientProvider>
          </NotificationClientProvider>
        </ContractClientProvider>
      </OperationClientProvider>
    </ThemeProvider>
  );
}

export default App;

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

function App() {
  return (
    <ThemeProvider>
      <OperationClientProvider>
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
      </OperationClientProvider>
    </ThemeProvider>
  );
}

export default App;

import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { ThemeProvider } from "./app/theme/ThemeProvider";
import { UserProvider } from "./modules/user/providers/UserProvider";
import { NotificationProvider } from "./modules/notification/providers/NotificationProvider";
import { ClientsProvider } from "./app/ClientsProvider";
import { UserPermissionProvider } from "./modules/user-permissions/providers/UserPermissionProvider";

function App() {
  return (
    <ClientsProvider>
      <ThemeProvider>
        <UserProvider>
          <NotificationProvider>
            <UserPermissionProvider  >
              <RouterProvider router={router} />
            </UserPermissionProvider>
          </NotificationProvider>
        </UserProvider>
      </ThemeProvider>
    </ClientsProvider>
  );
}

export default App;

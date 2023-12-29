import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { DriveClientProvider } from "./modules/drive/providers/DriveClientProvider";
import { ThemeProvider } from "./app/theme/ThemeProvider";
import { UserProvider } from "./modules/user/providers/UserProvider";
import { UserClientProvider } from "./modules/user/providers/UserClientProvider";

function App() {
  return (
    <ThemeProvider>
      <UserClientProvider>
        <DriveClientProvider>
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </DriveClientProvider>
      </UserClientProvider>
    </ThemeProvider>
  );
}

export default App;

import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { DriveClientProvider } from "./modules/drive/providers/DriveClientProvider";
import { ThemeProvider } from "./app/theme/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <DriveClientProvider>
        <RouterProvider router={router} />
      </DriveClientProvider>
    </ThemeProvider>
  );
}

export default App;

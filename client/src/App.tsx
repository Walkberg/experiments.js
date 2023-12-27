import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { DriveClientProvider } from "./modules/drive/providers/DriveClientProvider";

function App() {
  return (
    <DriveClientProvider>
      <RouterProvider router={router} />
    </DriveClientProvider>
  );
}

export default App;

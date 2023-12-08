import "./App.css";
import { Button } from "./components/ui/button";
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { RedactionPage } from "./modules/redaction/page/RedactionPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Test />}>
      <Route path="dashboard" element={<Cool />} />
      <Route path="mynotary" >
        <Route path="redaction" element={<RedactionPage />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

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

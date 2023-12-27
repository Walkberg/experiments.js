import { Outlet } from "react-router";
import { SidebarProvider } from "../sidebar/providers/SidebarProvider";
import { Sidebar } from "../sidebar/components/Sidebar";

export const PageTemplate = () => {
  return (
    <SidebarProvider>
      <div className="flex flex-grow w-screen h-screen bg-green-600">
        <Sidebar />
        <div className="flex flex-grow bg-white m-1 p-2 rounded-lg">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

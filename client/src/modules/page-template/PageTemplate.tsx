import { Outlet } from "react-router";
import { SidebarProvider } from "../sidebar/providers/SidebarProvider";
import { Sidebar } from "../sidebar/components/Sidebar";

export const PageTemplate = () => {
  return (
    <SidebarProvider>
      <div className="flex flex-grow w-screen h-screen bg-background">
        <Sidebar />
        <div className="flex flex-grow bg-background m-1 p-2 rounded-lg">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

import { Outlet, redirect } from "react-router";
import { SidebarProvider } from "../mynotary-clone/modules/sidebar/providers/SidebarProvider";
import { Sidebar } from "../mynotary-clone/modules/sidebar/components/Sidebar";
import { Header } from "@/modules/header/components/Header";

export const PageTemplate = () => {
  return (
    <SidebarProvider>
      <div className="flex flex-grow w-screen h-screen bg-background">
        <Sidebar />
        <div className="flex flex-grow flex-col bg-background m-1 p-2 rounded-lg">
          <Header />
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

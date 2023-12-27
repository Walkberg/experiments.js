import { Button } from "@/components/ui/button";
import { useSidebar } from "../providers/SidebarProvider";
import { SidebarItem } from "./SidebarItem";
import { TvIcon } from "lucide-react";

export const Sidebar = () => {
  const { items, toggleSidebar } = useSidebar();
  return (
    <div className="  p-2">
      <div className="flex  flex-col items-center gap-4">
        <Button onClick={toggleSidebar} variant={"ghost"}>
          <TvIcon />
        </Button>
        <div className="flex flex-col items-center gap-2">
          {items.map((item) => (
            <SidebarItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

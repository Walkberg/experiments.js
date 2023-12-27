import { Button } from "@/components/ui/button";
import { useSidebar } from "../providers/SidebarProvider";
import { SidebarItem } from "./SidebarItem";
import { Moon, Sun, TvIcon } from "lucide-react";
import { useTheme } from "@/app/theme/ThemeProvider";

export const Sidebar = () => {
  const { appTheme, setTheme } = useTheme();
  const { items, toggleSidebar } = useSidebar();
  return (
    <div className="flex p-2 border-r-2">
      <div className="flex flex-grow flex-col items-center justify-between ">
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
        <Button variant={"ghost"}>
          {appTheme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>
    </div>
  );
};

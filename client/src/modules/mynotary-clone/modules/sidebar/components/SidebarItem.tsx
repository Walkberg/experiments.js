import { Button } from "@/components/ui/button";
import { SidebarItem as SidebarItemType } from "../sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "../providers/SidebarProvider";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  item: SidebarItemType;
}

export const SidebarItem = ({ item }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = item.to && location.pathname.startsWith(item.to);

  const { collapsed } = useSidebar();

  return (
    <Link to={item.to ?? ""}>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <div className=" border-solid border-spacing-1 bg-gradient-to-br rounded">
            <TooltipTrigger asChild>
              <div className="flex items-center ">
                <Button className="flex items-center  gap-4" variant="ghost">
                  {item.icon}
                  {!collapsed && (
                    <p className="w-20 pr-4 text-left">{item.name}</p>
                  )}
                </Button>
              </div>
            </TooltipTrigger>
          </div>
          <TooltipContent>
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  );
};

import { Button } from "@/components/ui/button";
import { SidebarItem as SidebarItemType } from "../sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "../providers/SidebarProvider";

interface SidebarItemProps {
  item: SidebarItemType;
}

export const SidebarItem = ({ item }: SidebarItemProps) => {
  const { collapsed } = useSidebar();

  return (
    <div>
      <TooltipProvider>
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
    </div>
  );
};

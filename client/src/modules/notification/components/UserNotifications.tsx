import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Search } from "lucide-react";
import { NotificationList } from "./NotificationList";
import { useNotifications } from "../providers/NotificationProvider";

export const UserNotification = () => {
  const { notifications } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button variant={"ghost"}>
          <Bell />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-200">
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">Toute les notifications</TabsTrigger>
            <TabsTrigger value="archived">Archivé</TabsTrigger>
          </TabsList>
          <div className="bg-background/95 pt-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8" />
              </div>
            </form>
          </div>
          <TabsContent value={"all"}>
            <NotificationList
              notifications={notifications.filter(
                (notification) => !notification.archived
              )}
            />
          </TabsContent>
          <TabsContent value={"archived"}>
            <NotificationList
              notifications={notifications.filter(
                (notification) => notification.archived
              )}
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

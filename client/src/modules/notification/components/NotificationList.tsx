import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Notification } from "../notifications";
import { cn } from "@/lib/utils";

interface NotificationListProps {
  notifications: Notification[];
}

export const NotificationList = ({ notifications }: NotificationListProps) => {
  const mail = {
    selected: "1",
  };
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-1 pt-0">
        {notifications.map((notification) => (
          <button
            key={notification.id}
            className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
            onClick={() => {}}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{notification.name}</div>
                  {!notification.viewed && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    mail.selected === notification.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                ></div>
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground"></div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

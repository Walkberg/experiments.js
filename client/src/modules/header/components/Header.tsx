import { UserNotification } from "@/modules/mynotary-clone/modules/notification/components/UserNotifications";
import { UserAvatar } from "@/modules/mynotary-clone/modules/user/components/UserAvatar";
import { useUser } from "@/modules/mynotary-clone/modules/user/providers/UserProvider";

export const Header = () => {
  const { user } = useUser();

  if (user == null) {
    return;
  }

  return (
    <div className="flex flex-row items-center h-12 justify-between">
      <div></div>
      <div className="flex flex-row items-center gap-3 pr-5">
        <UserNotification />
        <UserAvatar user={user} />
      </div>
    </div>
  );
};

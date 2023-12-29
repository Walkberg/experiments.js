import { UserNotification } from "@/modules/notification/notification";
import { UserAvatar } from "@/modules/user/components/UserAvatar";
import { useUser } from "@/modules/user/providers/UserProvider";

export const Header = () => {
  const { user } = useUser();

  console.log(user);

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

import { UserNotification } from "@/modules/notification/notification";
import { UserAvatar } from "@/modules/user/components/UserAvatar";
import { User } from "@/modules/user/user";

export const Header = () => {
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

const user: User = {
  firstname: "test",
  lastname: "test",
  email: "test@test.fr",
  id: "user-1",
  avatarUrl: "test",
};

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "../user";
import { Button } from "@/components/ui/button";

interface UserAvatarProps {
  user: User;
}

export const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <Avatar className="h-10">
      <AvatarImage src="https://github.com/walkberg.png" alt="@walberg" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

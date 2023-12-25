import { ReactNode } from "react";

interface HeaderProps {
  children: ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  return <div className="flex">{children}</div>;
};

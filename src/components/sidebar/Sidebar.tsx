import { ReactNode } from "react";

interface SidebarProps {
    children:ReactNode;
}

export const Sidebar = ({children}:SidebarProps) => {
    return (<div>{children}</div>)

}
import { ReactNode } from "react";

export interface SidebarItem {
  name: string;
  description?: string;
  icon: ReactNode;
  to?: string;
}

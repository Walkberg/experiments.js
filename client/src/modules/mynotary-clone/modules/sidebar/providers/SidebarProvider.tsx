import { ReactNode, createContext, useContext, useState } from "react";

import { SidebarItem } from "../sidebar";
import { Apple, Cat, Drumstick, Fish, Sheet } from "lucide-react";

interface SidebarState {
  collapsed: boolean;
  items: SidebarItem[];
  toggleSidebar: () => void;
}

const defaultItems: SidebarItem[] = [
  {
    name: "Fish",
    description: "Fish",
    icon: <Fish />,
    to: "/mynotary/users",
  },
  {
    name: "Organizations",
    description: "Organizations",
    icon: <Drumstick />,
    to: "/mynotary/organizations",
  },
  {
    name: "Members",
    description: "Members",
    icon: <Apple />,
    to: "/mynotary/members",
  },

  {
    name: "Dossiers",
    description: "Dossiers",
    icon: <Cat />,
    to: "/mynotary/operations",
  },
  {
    name: "Fiches",
    description: "Fiches",
    icon: <Cat />,
    to: "/mynotary/fiches",
  },
  {
    name: "Config Fiches",
    description: "Config Fiches",
    icon: <Sheet />,
    to: "/mynotary/fiches-config",
  },
  {
    name: "Configs",
    description: "Configs",
    icon: <Drumstick />,
    to: "/mynotary/configs",
  },
];

const SidebarContext = createContext<SidebarState | null>(null);

interface DriveProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: DriveProviderProps) => {
  const [collapsed, setCollapsed] = useState(true);

  const toogleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{ items: defaultItems, collapsed, toggleSidebar: toogleSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (context == null) {
    throw new Error();
  }

  return context;
}

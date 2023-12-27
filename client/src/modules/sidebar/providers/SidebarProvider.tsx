import { ReactNode, createContext, useContext, useState } from "react";

import { SidebarItem } from "../sidebar";
import { Apple, Cat, Drumstick, Fish } from "lucide-react";

interface SidebarState {
  collapsed: boolean;
  items: SidebarItem[];
  toggleSidebar: () => void;
}

const defaultItems: SidebarItem[] = [
  {
    name: "Apple",
    description: "Apple",
    icon: <Apple />,
  },

  {
    name: "Cat",
    description: "Cat",
    icon: <Cat />,
  },

  {
    name: "Drumstick",
    description: "Drumstick",
    icon: <Drumstick />,
  },

  {
    name: "Fish",
    description: "Fish",
    icon: <Fish />,
  },
];

const SidebarContext = createContext<SidebarState | null>(null);

interface DriveProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: DriveProviderProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const toogleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

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

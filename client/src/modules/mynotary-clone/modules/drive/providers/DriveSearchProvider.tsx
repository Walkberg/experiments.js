import { ReactNode, createContext, useContext, useState } from "react";

interface DriveSearchContextType {
  search: string;
  updateSearch: (search: string) => void;
}

const DriveSearchContext = createContext<DriveSearchContextType | null>(null);

interface DriveProviderProps {
  children: ReactNode;
}

export const DriveSearchProvider = ({ children }: DriveProviderProps) => {
  const [search, setSearch] = useState("");

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  return (
    <DriveSearchContext.Provider value={{ search, updateSearch }}>
      {children}
    </DriveSearchContext.Provider>
  );
};

export function useSearch() {
  const context = useContext(DriveSearchContext);

  if (context == null) {
    throw new Error();
  }

  return { search: context.search, updateSearch: context.updateSearch };
}

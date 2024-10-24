import { ReactNode, createContext } from "react";

interface BalatroContextType {
  seed: string;
}

export const BalatroContext = createContext<BalatroContextType | null>(null);

interface BalatroProviderProps {
  children: ReactNode;
  seed: string;
}

export const BalatroProvider = ({ children, seed }: BalatroProviderProps) => {
  return (
    <BalatroContext.Provider value={{ seed }}>
      {children}
    </BalatroContext.Provider>
  );
};

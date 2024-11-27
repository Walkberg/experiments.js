import { ReactNode, createContext, useContext } from "react";
import { useBalatroGame } from "./useBalatro";
import { BalatroEngine } from "./balatro-engine";

interface BalatroContextType {
  seed: string;
  balatro: BalatroEngine | null;
}

export const BalatroContext = createContext<BalatroContextType | null>(null);

interface BalatroProviderProps {
  children: ReactNode;
  seed: string;
}

export const BalatroProvider = ({ children, seed }: BalatroProviderProps) => {
  const { balatro } = useBalatroGame();

  return (
    <BalatroContext.Provider value={{ seed, balatro }}>
      {children}
    </BalatroContext.Provider>
  );
};

export const useCurrentGame = () => {
  const context = useContext(BalatroContext);

  if (context == null) {
    throw new Error(
      "useBattleGround must be used within a BattleGroundProvider"
    );
  }

  return context;
};

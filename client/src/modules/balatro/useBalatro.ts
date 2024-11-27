import { useEffect, useState } from "react";
import {
  BalatroEngine,
  createBalatroEngine,
  createBlindManagerPlugin,
  createDeckPlugin,
  createGamePlugin,
  createHandPlugin,
  createPlayedCardPlugin,
  createScorePlugin,
} from "./balatro-engine";

export const useBalatroGame = () => {
  const [balatro, setBalatro] = useState<BalatroEngine | null>(null);

  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const balatro = createBalatroEngine();

    const deckPlugin = createDeckPlugin();
    const handPlugin = createHandPlugin();
    const bliandManagerPlugin = createBlindManagerPlugin();
    const playedCardPlugin = createPlayedCardPlugin();
    const scorePlugin = createScorePlugin();
    const gamePlugin = createGamePlugin();

    balatro.registerPlugin(deckPlugin);
    balatro.registerPlugin(handPlugin);
    balatro.registerPlugin(playedCardPlugin);
    balatro.registerPlugin(scorePlugin);
    balatro.registerPlugin(bliandManagerPlugin);
    balatro.registerPlugin(gamePlugin);

    gamePlugin.startGame();

    balatro.onEvent("phase-changed", () =>
      setRefreshCounter(refreshCounter + 1)
    );

    setBalatro(balatro);
  }, []);

  return { balatro, refreshCounter };
};

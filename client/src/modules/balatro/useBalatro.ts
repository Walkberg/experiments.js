import { useEffect, useState } from "react";
import {
  BalatroEngine,
  createBalatroEngine,
  createBlindManagerPlugin,
  createDeckPlugin,
  createEconomyManagerPlugin,
  createGamePlugin,
  createPlayedCardPlugin,
  createPlayerManagerPlugin,
} from "./balatro-engine";
import { createHandPlugin } from "./plugins/hand-manager-plugin";
import { createScorePlugin } from "./plugins";
import { createPoolManagerPlugin } from "./plugins/pool-manager-plugin";
import { createBuffonManagerPlugin } from "./plugins/buffons-manager-plugin";
import { createShopPlugin } from "./plugins/shop-plugin";
import { buffonsPlayer } from "./buffons";
import { createConsumableManagerPlugin } from "./plugins/consumables-manager-plugin";
import { createHandScoreManagerPlugin } from "./plugins/hand-score-manager-plugin";
import { itemsPlayer } from "./consumables";

export const useBalatroGame = () => {
  const [balatro, setBalatro] = useState<BalatroEngine | null>(null);

  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const balatro = createBalatroEngine();

    const deckPlugin = createDeckPlugin();
    const handPlugin = createHandPlugin();
    const economyManagerPlugin = createEconomyManagerPlugin();
    const bliandManagerPlugin = createBlindManagerPlugin();
    const buffonManagerPlugin = createBuffonManagerPlugin();
    const itemsManagerPlugin = createConsumableManagerPlugin();
    const playerManagerPlugin = createPlayerManagerPlugin();
    const playedCardPlugin = createPlayedCardPlugin();
    const poolManagerPlugin = createPoolManagerPlugin();
    const shopPlugin = createShopPlugin();
    const gamePlugin = createGamePlugin();
    const scorePlugin = createScorePlugin();
    const handScoreManager = createHandScoreManagerPlugin();

    poolManagerPlugin.registerBuffons(buffonsPlayer);
    poolManagerPlugin.registerItems(itemsPlayer);

    balatro.registerPlugin(playerManagerPlugin);
    balatro.registerPlugin(economyManagerPlugin);
    balatro.registerPlugin(handScoreManager);
    balatro.registerPlugin(deckPlugin);
    balatro.registerPlugin(handPlugin);
    balatro.registerPlugin(playedCardPlugin);
    balatro.registerPlugin(buffonManagerPlugin);
    balatro.registerPlugin(itemsManagerPlugin);
    balatro.registerPlugin(scorePlugin);
    balatro.registerPlugin(bliandManagerPlugin);
    balatro.registerPlugin(poolManagerPlugin);
    balatro.registerPlugin(shopPlugin);
    balatro.registerPlugin(gamePlugin);

    gamePlugin.startGame();

    balatro.onEvent("phase-changed", () =>
      setRefreshCounter(refreshCounter + 1)
    );

    setBalatro(balatro);
  }, []);

  return { balatro, refreshCounter };
};

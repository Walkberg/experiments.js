import { useState, useEffect } from "react";
import { Engine, createEngine, removeMod } from "../../game";
import { createShopPlugin } from "../../plugins/shop-plugin";
import { createPlayerPlugin } from "../../plugins/player-plugin";
import { createEconomyPlugin } from "../../plugins/economy-plugin";
import { createPoolManagerPlugin } from "../../plugins/pool-manager-plugin";
import { createOpponentPlugin } from "../../plugins/opponent";
import { maSuperCard, maSuperCard2 } from "../../core/cards/card";
import { createGameManagerPlugin } from "../../plugins/game-manager-plugin";

export const useGame = () => {
  const [game, setGame] = useState<Engine | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const myGame = createEngine();

    const playerPlugin = createPlayerPlugin();
    const opponentPlugin = createOpponentPlugin({ count: 8 });
    const shopPlugin = createShopPlugin();
    const economyPlugin = createEconomyPlugin();
    const poolManagerPlugin = createPoolManagerPlugin();
    const gameManagerPlugin = createGameManagerPlugin();

    poolManagerPlugin.addCard(maSuperCard);
    poolManagerPlugin.addCard(maSuperCard2);

    poolManagerPlugin.initialize();

    myGame.registerPlugin(playerPlugin);
    myGame.registerPlugin(opponentPlugin);
    myGame.registerPlugin(shopPlugin);
    myGame.registerPlugin(economyPlugin);
    myGame.registerPlugin(poolManagerPlugin);
    myGame.registerPlugin(gameManagerPlugin);

    myGame.onEvent("test", (payload) => {
      setRefreshCounter((prev) => prev + 1);
    });

    myGame.onEvent("shop-rolled", (card) =>
      setRefreshCounter((prev) => prev + 1)
    );

    myGame.onEvent("card-bought", (card) =>
      setRefreshCounter((prev) => prev + 1)
    );

    myGame.onEvent("cardPlayed", (card) =>
      setRefreshCounter((prev) => prev + 1)
    );

    setGame(myGame);

    return () => removeMod("mon-mod", myGame);
  }, []);

  return { messages, game, refreshCounter };
};

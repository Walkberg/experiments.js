import { useEffect, useState } from "react";
import { BalatroEngine, createBalatroEngine } from "./balatro-engine";
import { createPlayerManagerPlugin } from "./plugins/player-manager-plugin";
import { createEconomyManagerPlugin } from "./plugins/economy-manager-plugin";
import { createGamePlugin } from "./plugins/game-manager";
import { createAnteManagerPlugin } from "./plugins/blind-manager-plugin";
import { createDeckPlugin } from "./plugins/deck-manager-plugin";
import { createHandPlugin } from "./plugins/hand-manager-plugin";
import { createScorePlugin } from "./plugins";
import { createPoolManagerPlugin } from "./plugins/pool-manager-plugin";
import { createBuffonManagerPlugin } from "./plugins/buffons-manager-plugin";
import { createShopPlugin } from "./plugins/shop-plugin";
import { buffonsPlayer } from "./cards/buffons";
import { createConsumableManagerPlugin } from "./plugins/consumables-manager-plugin";
import { createHandScoreManagerPlugin } from "./plugins/hand-score-manager-plugin";
import { itemsPlayer } from "./cards/planets";
import { createEnhancementPlugin } from "./plugins/enhancement-plugin";
import { createSealPlugin } from "./plugins/seal-plugin";
import { createEditionPlugin } from "./plugins/edition-plugin";
import { enhancements } from "./cards/enhancements";
import { creatGoldSeal } from "./cards/seal";
import { createBaseEdition } from "./cards/editions";
import { createSeedManagerPlugin } from "./plugins/seed-manager-plugin";
import { createStatManagerPlugin } from "./plugins/stats-manager-plugin";
import { createDecksPlugin } from "./plugins/decks-manager-plugin";
import { decks } from "./decks/decks";
import { createShopPackPlugin } from "./plugins/shop-pack-plugin";
import { createScoreCommandManagerPlugin } from "./plugins/score-command-plugin";

export const useBalatroGame = () => {
  const [balatro, setBalatro] = useState<BalatroEngine | null>(null);

  useEffect(() => {
    const balatro = createBalatroEngine();

    const deckPlugin = createDeckPlugin();
    const handPlugin = createHandPlugin();
    const economyManagerPlugin = createEconomyManagerPlugin();
    const bliandManagerPlugin = createAnteManagerPlugin();
    const buffonManagerPlugin = createBuffonManagerPlugin();
    const itemsManagerPlugin = createConsumableManagerPlugin();
    const playerManagerPlugin = createPlayerManagerPlugin();
    const poolManagerPlugin = createPoolManagerPlugin();
    const shopPlugin = createShopPlugin();
    const gamePlugin = createGamePlugin();
    const scorePlugin = createScorePlugin();
    const handScoreManager = createHandScoreManagerPlugin();
    const enhancementManager = createEnhancementPlugin();
    const sealManager = createSealPlugin();
    const editionManager = createEditionPlugin();
    const seedManagerPlugin = createSeedManagerPlugin();
    const statManagerPlugin = createStatManagerPlugin();
    const decksManagerPlugin = createDecksPlugin();
    const shopPackPlugin = createShopPackPlugin();
    const scoreCommandPlugin = createScoreCommandManagerPlugin();

    poolManagerPlugin.registerBuffons(buffonsPlayer);
    poolManagerPlugin.registerItems(itemsPlayer);

    enhancementManager.registerEnhancements(enhancements);
    sealManager.registerSeal(creatGoldSeal());
    editionManager.registerEdition(createBaseEdition());
    decksManagerPlugin.addDecks(decks);

    balatro.registerPlugin(statManagerPlugin);
    balatro.registerPlugin(seedManagerPlugin);
    balatro.registerPlugin(playerManagerPlugin);
    balatro.registerPlugin(economyManagerPlugin);
    balatro.registerPlugin(handScoreManager);
    balatro.registerPlugin(deckPlugin);
    balatro.registerPlugin(handPlugin);
    balatro.registerPlugin(buffonManagerPlugin);
    balatro.registerPlugin(itemsManagerPlugin);
    balatro.registerPlugin(scorePlugin);
    balatro.registerPlugin(bliandManagerPlugin);
    balatro.registerPlugin(poolManagerPlugin);
    balatro.registerPlugin(shopPackPlugin);
    balatro.registerPlugin(shopPlugin);
    balatro.registerPlugin(enhancementManager);
    balatro.registerPlugin(decksManagerPlugin);
    balatro.registerPlugin(scoreCommandPlugin);

    balatro.registerPlugin(gamePlugin);

    seedManagerPlugin.setSeed("JL4365TK");

    setBalatro(balatro);
  }, []);

  return { balatro };
};

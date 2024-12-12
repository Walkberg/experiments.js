import { BalatroEngine } from "../balatro-engine";
import { getScoreManagerPlugin } from "../plugins";
import { EnhancementHandler, PokerCard } from "./poker-cards";

export const createGoldEnhancement = (): EnhancementHandler => {
  const type = "gold";

  function init(context: BalatroEngine) {
    const scorePlugin = getScoreManagerPlugin(context);

    context.onEvent("score-card-calculated", (card: PokerCard) => {
      if (card.enhancement === type) {
        console.log("Gold enhancement applyed");
        scorePlugin.addChip(10000);
      }
    });
  }

  return { type, init };
};

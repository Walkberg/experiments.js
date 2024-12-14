import { BalatroEngine } from "../balatro-engine";
import { getScoreManagerPlugin } from "../plugins";
import { EnhancementHandler, PokerCard } from "./poker-cards";

export const createGoldEnhancement = (): EnhancementHandler => {
  const type = "gold";

  function init(context: BalatroEngine) {
    const scorePlugin = getScoreManagerPlugin(context);

    context.onEvent("score-card-calculated", (card: PokerCard) => {
      if (card.enhancement === type) {
        scorePlugin.addChip(10000);
      }
    });
  }

  return { type, init };
};

export const createMultiEnhancement = (): EnhancementHandler => {
  const type = "mult";

  function init(context: BalatroEngine) {
    const scorePlugin = getScoreManagerPlugin(context);

    context.onEvent("score-card-calculated", (card: PokerCard) => {
      if (card.enhancement === type) {
        scorePlugin.addMultiplier(4);
      }
    });
  }

  return { type, init };
};

export const createBonusEnhancement = (): EnhancementHandler => {
  const type = "bonus";

  function init(context: BalatroEngine) {
    const scorePlugin = getScoreManagerPlugin(context);

    context.onEvent("score-card-calculated", (card: PokerCard) => {
      if (card.enhancement === type) {
        scorePlugin.addChip(30);
      }
    });
  }

  return { type, init };
};

export const createGlassEnhancement = (): EnhancementHandler => {
  const type = "bonus";

  function init(context: BalatroEngine) {
    const scorePlugin = getScoreManagerPlugin(context);

    context.onEvent("score-calculated", () => {});
  }

  return { type, init };
};

export const enhancements: EnhancementHandler[] = [
  createGoldEnhancement(),
  createMultiEnhancement(),
  createBonusEnhancement(),
];

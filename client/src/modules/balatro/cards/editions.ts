import { BalatroEngine } from "../balatro-engine";
import { getScoreManagerPlugin } from "../plugins";
import { EditionHandler, PokerCard } from "./poker-cards";

export const createBaseEdition = (): EditionHandler => {
  const type = "base";

  function init(context: BalatroEngine) {
    const scorePlugin = getScoreManagerPlugin(context);

    context.onEvent("score-card-calculated", (card: PokerCard) => {
      if (card.edition === type) {
        scorePlugin.addChip(10000);
      }
    });
  }

  return { type, init };
};

import { BalatroEngine } from "../balatro-engine";
import { getScoreManagerPlugin } from "../plugins";
import { PokerCard, SealHandler } from "./poker-cards";

export const creatGoldSeal = (): SealHandler => {
  const type = "gold";

  function init(context: BalatroEngine) {
    const scorePlugin = getScoreManagerPlugin(context);

    context.onEvent("score-card-calculated", (card: PokerCard) => {
      if (card.seal === type) {
        console.log("Gold seal applyed");
        scorePlugin.addChip(10000);
      }
    });
  }

  return { type, init };
};

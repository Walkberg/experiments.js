import { BalatroEngine, Plugin } from "../balatro-engine";

export interface PokerCardLifecyclePlugin extends Plugin {}

export function createPokerCardLifecyclePlugin(): PokerCardLifecyclePlugin {
  let _engine: BalatroEngine;

  function init(engine: BalatroEngine) {
    _engine = engine;

    engine.onEvent("card-played", (event) => {
      console.log("Card played", event);
    });
  }

  function improveCardValue(cardId: string, value: number) {
    console.log("Improving card value", cardId, value);
  }

  return {
    name: "card-lifecycle",
    init,
  };
}

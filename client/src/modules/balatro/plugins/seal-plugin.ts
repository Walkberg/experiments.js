import { BalatroEngine, Plugin } from "../balatro-engine";
import { SealHandler, SealManager } from "../cards/poker-cards";

interface SealPlugin extends Plugin {
  registerSeal: (handler: SealHandler) => void;
}

export function createSealPlugin(): SealPlugin {
  const SealsManager = new SealManager();

  function init(engine: BalatroEngine) {
    for (const handler of SealsManager.getHandlers()) {
      handler.init(engine);
    }
  }

  function registerSeal(handler: SealHandler) {
    SealsManager.registerHandler(handler);
  }

  return {
    name: "Seals-plugin",
    init,
    registerSeal,
  };
}

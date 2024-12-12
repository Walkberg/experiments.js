import { BalatroEngine, Plugin } from "../balatro-engine";
import { SealHandler, SealManager } from "../cards/poker-cards";

interface SealPlugin extends Plugin {
  registerSeal: (handler: SealHandler) => void;
  registerSeals: (handler: SealHandler[]) => void;
}

export function createSealPlugin(): SealPlugin {
  const sealsManager = new SealManager();

  function init(engine: BalatroEngine) {
    for (const handler of sealsManager.getHandlers()) {
      handler.init(engine);
    }
  }

  function registerSeal(handler: SealHandler) {
    sealsManager.registerHandler(handler);
  }

  function registerSeals(handlers: SealHandler[]) {
    handlers.forEach((handler) => {
      registerSeal(handler);
    });
  }

  return {
    name: "Seals-plugin",
    init,
    registerSeal,
    registerSeals,
  };
}

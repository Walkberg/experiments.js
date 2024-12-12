import { BalatroEngine, Plugin } from "../balatro-engine";
import { EnhancementHandler, EnhancementManager } from "../cards/poker-cards";

interface EnhancementPlugin extends Plugin {
  registerEnhancement: (handler: EnhancementHandler) => void;
}

export function createEnhancementPlugin(): EnhancementPlugin {
  const enhancementHandler = new EnhancementManager();

  function init(engine: BalatroEngine) {
    for (const handler of enhancementHandler.getHandlers()) {
      handler.init(engine);
    }
  }

  function registerEnhancement(handler: EnhancementHandler) {
    enhancementHandler.registerHandler(handler);
  }

  return {
    name: "enhancement-plugin",
    init,
    registerEnhancement,
  };
}

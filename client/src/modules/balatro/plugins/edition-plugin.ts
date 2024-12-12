import { BalatroEngine, Plugin } from "../balatro-engine";
import { EditionHandler, EditionManager } from "../cards/poker-cards";

interface EditionPlugin extends Plugin {
  registerEdition: (handler: EditionHandler) => void;
}

export function createEditionPlugin(): EditionPlugin {
  const editionsManager = new EditionManager();

  function init(engine: BalatroEngine) {
    for (const handler of editionsManager.getHandlers()) {
      handler.init(engine);
    }
  }

  function registerEdition(handler: EditionHandler) {
    editionsManager.registerHandler(handler);
  }

  return {
    name: "editions-plugin",
    init,
    registerEdition,
  };
}

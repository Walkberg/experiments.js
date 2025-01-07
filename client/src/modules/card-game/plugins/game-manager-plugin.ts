import { Plugin, Engine } from "../game";
import { getEconomyPlugin } from "./economy-plugin";

export type Phase = "Shop" | "Fight";

export interface GameManagerPlugin extends Plugin {
  getPhase: () => Phase;
  transitionTo: (phase: Phase) => void;
}

export function createGameManagerPlugin(): GameManagerPlugin {
  let _engine: Engine;
  let _phase: Phase = "Shop";

  let _currentState: State;

  const plugin: GameManagerPlugin = {
    name: "game",
    init,
    getPhase: () => _phase,
    transitionTo,
  };

  const states: Record<Phase, State> = {
    Shop: createShopState(),
    Fight: createFightState(),
  };

  function init(engine: Engine) {
    _engine = engine;

    transitionTo("Shop");
  }

  function transitionTo(phase: Phase) {
    _phase = phase;

    _engine.emitEvent("phase-change", phase);
    if (_currentState) {
      _currentState.onExit(_engine);
    }
    _currentState = states[phase];
    _currentState.onEnter(_engine);
    _engine.emitEvent("phase-changed", phase);
  }

  function handleEvent(event: string, payload?: any) {
    _currentState.onEvent?.(event, payload);
  }

  return plugin;
}

interface State {
  onEnter: (engine: Engine) => void;

  onExit: (engine: Engine) => void;

  onEvent: (event: string, payload?: any) => void;
}

function createShopState(): State {
  let timerId: NodeJS.Timeout;

  return {
    onEnter(engine: Engine) {
      const gameManager = getGameManagerPlugin(engine);
      const economyManager = getEconomyPlugin(engine);

      console.log("Shop state entered", economyManager.getMaxMoney());

      if (economyManager.getMaxMoney() < 10) {
        economyManager.addMaxMoney(1);
      }

      economyManager.resetMoney();

      timerId = setTimeout(() => {
        gameManager.transitionTo("Fight");
      }, 15000);
    },
    onExit(engine: Engine) {
      if (timerId) {
        clearTimeout(timerId);
      }
    },
    onEvent(event, payload) {},
  };
}

function createFightState(): State {
  let timerId: NodeJS.Timeout;

  return {
    onEnter(engine: Engine) {
      const gameManager = getGameManagerPlugin(engine);
      timerId = setTimeout(() => {
        gameManager.transitionTo("Shop");
      }, 3000);
    },
    onExit(engine: Engine) {
      if (timerId) {
        clearTimeout(timerId);
      }
    },
    onEvent(event, payload) {},
  };
}

export function getGameManagerPlugin(engine: Engine): GameManagerPlugin {
  const gameManager = engine.getPlugin<GameManagerPlugin>("game");

  if (!gameManager) {
    throw new Error("Game manager plugin not found!");
  }
  return gameManager;
}

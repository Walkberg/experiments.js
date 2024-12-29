import { Hand } from "../balatro";
import { BalatroEngine, Plugin } from "../balatro-engine";
import { EconomyManagerPlugin } from "./economy-manager-plugin";
import {
  DeckManagerPlugin,
  HandManagerPlugin,
  ScoreManagerPlugin,
  BlindManagerPlugin,
  ShopPlugin,
} from ".";

export type Phase =
  | "Menu"
  | "Start"
  | "Pause"
  | "Play"
  | "BlindWin"
  | "Score"
  | "Shop"
  | "Blind"
  | "Reset"
  | "GameOver";

export interface GameManagerPlugin extends Plugin {
  startGame: () => void;
  returnMenu: () => void;
  getPhase: () => Phase;
  endTurn: () => void;
  startNextPhase: () => void;
}

export function createGamePlugin(): GameManagerPlugin {
  let _engine: BalatroEngine;
  let _deck: DeckManagerPlugin;
  let _hand: HandManagerPlugin;
  let _score: ScoreManagerPlugin;
  let _blind: BlindManagerPlugin;
  let _economyManager: EconomyManagerPlugin;
  let _shopManager: ShopPlugin;

  let _phase: Phase = "Pause";

  let _currentState: State;

  const states: Record<Phase, State> = {
    Menu: {
      onEnter() {
        changePhase("Menu");
      },
      onExit() {},
      onEvent() {},
    },
    Start: {
      onEnter() {
        changePhase("Start");
        _blind.reset();
        _deck.generateDeck();
        _hand.fillHand();
        transitionTo("Blind");
      },
      onExit() {},
      onEvent() {},
    },
    Pause: {
      onEnter() {
        changePhase("Pause");
      },
      onExit() {},
      onEvent() {},
    },
    Play: {
      onEnter() {
        changePhase("Play");
      },
      onExit() {},
      onEvent(event, payload) {
        if (event === "hand-played") {
          setTimeout(() => {
            transitionTo("Score");
          }, 10);
        }
      },
    },
    Reset: {
      onEnter() {
        _score.resetScore();
        _hand.reset();
        _deck.resetDeck();
        _hand.fillHand();
        changePhase("Reset");
        transitionTo("Shop");
      },
      onExit() {},
      onEvent(event, payload) {},
    },
    Score: {
      onEnter() {
        changePhase("Score");
        _score.calculateScore();
      },
      onExit() {},
      onEvent(event, payload) {
        if (event === "score-calculated") {
          const roundScore = _score.getRoundScore();
          const blindScore = _blind.getCurrentBlind()?.score ?? 0;

          setTimeout(() => {
            if (roundScore < blindScore) {
              if (_hand.getRemainingHands() === 0) {
                transitionTo("GameOver");
              } else {
                _hand.fillHand();
                transitionTo("Play");
              }
            } else {
              transitionTo("BlindWin");
            }
          }, 1000);
        }
      },
    },
    BlindWin: {
      onEnter() {
        changePhase("BlindWin");
      },
      onExit() {},
      onEvent(event, payload) {
        if (event === "phase-next") {
          transitionTo("Reset");
        }
      },
    },
    Shop: {
      onEnter() {
        _shopManager.resetShop();
        changePhase("Shop");
      },
      onExit() {},
      onEvent(event, payload) {
        if (event === "phase-next") {
          _blind.selectNextBlind();
          transitionTo("Blind");
        }
      },
    },
    Blind: {
      onEnter() {
        changePhase("Blind");
      },
      onExit() {},
      onEvent(event, payload) {
        if (event === "blind-selected") {
          transitionTo("Play");
        }
      },
    },
    GameOver: {
      onEnter() {
        changePhase("GameOver");
      },
      onExit() {},
      onEvent() {},
    },
  };

  function init(engine: BalatroEngine) {
    _engine = engine;

    _deck = engine.getPlugin<DeckManagerPlugin>("deck")!;
    _hand = engine.getPlugin<HandManagerPlugin>("hand")!;
    _score = engine.getPlugin<ScoreManagerPlugin>("score")!;
    _blind = engine.getPlugin<BlindManagerPlugin>("blind-manager")!;
    _economyManager = engine.getPlugin<EconomyManagerPlugin>("economy")!;
    _shopManager = engine.getPlugin<ShopPlugin>("shop")!;

    _engine.onEvent("hand-played", (hand) => handleEvent("hand-played", hand));
    _engine.onEvent("score-calculated", () => handleEvent("score-calculated"));
    _engine.onEvent("phase-next", () => handleEvent("phase-next"));
    _engine.onEvent("blind-selected", () => handleEvent("blind-selected"));

    transitionTo("Menu");
  }

  function transitionTo(phase: Phase) {
    _phase = phase;
    console.log(`Transitioning to phase: ${phase}`);
    if (_currentState) {
      _currentState.onExit?.();
    }
    _currentState = states[phase];
    _currentState.onEnter?.();
  }

  function handleEvent(event: string, payload?: any) {
    _currentState.onEvent?.(event, payload);
  }

  function changePhase(phase: Phase) {
    _engine.emitEvent("phase-changed", { phase });
  }

  function startGame() {
    transitionTo("Start");
  }

  function returnMenu() {
    transitionTo("Menu");
  }

  function startNextPhase() {
    _engine.emitEvent("phase-next", {});
  }

  return {
    name: "game",
    init,
    startGame,
    returnMenu,
    endTurn: () => console.log("Turn ended"),
    getPhase: () => _phase,
    startNextPhase,
  };
}

interface State {
  onEnter?: () => void;

  onExit?: () => void;

  onEvent?: (event: string, payload?: any) => void;
}

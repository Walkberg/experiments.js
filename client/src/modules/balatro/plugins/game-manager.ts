import { Hand } from "../balatro";
import {
  BalatroEngine,
  PlayedCardManagerPlugin,
  Plugin,
} from "../balatro-engine";
import { EconomyManagerPlugin } from "./economy-manager-plugin";
import {
  DeckManagerPlugin,
  HandManagerPlugin,
  ScoreManagerPlugin,
  BlindManagerPlugin,
} from ".";

export type Phase =
  | "Menu"
  | "Start"
  | "Pause"
  | "Play"
  | "Score"
  | "Shop"
  | "Blind"
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
  let _playedCard: PlayedCardManagerPlugin;
  let _score: ScoreManagerPlugin;
  let _blind: BlindManagerPlugin;
  let _economyManager: EconomyManagerPlugin;

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
        _deck.generateDeck();
        drawCards(8);
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
      onExit() {
        _playedCard.reset();
      },
      onEvent(event, payload) {
        if (event === "hand-played") {
          setTimeout(() => {
            transitionTo("Score");
          }, 1000);
        }
      },
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
                drawCards(5);
                transitionTo("Play");
              }
            } else {
              transitionTo("Shop");
            }
          }, 1000);
        }
      },
    },
    Shop: {
      onEnter() {
        changePhase("Shop");
      },
      onExit() {},
      onEvent(event, payload) {
        if (event === "phase-next") {
          transitionTo("Blind");
        }
      },
    },
    Blind: {
      onEnter() {
        console.log("Blind");
        changePhase("Blind");
      },
      onExit() {},
      onEvent(event, payload) {
        console.log("blind-selected", event);
        if (event === "blind-selected") {
          _deck.generateDeck();
          _hand.reset();
          _score.resetScore();
          drawCards(8);
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
    _playedCard = engine.getPlugin<PlayedCardManagerPlugin>("played-card")!;
    _score = engine.getPlugin<ScoreManagerPlugin>("score")!;
    _blind = engine.getPlugin<BlindManagerPlugin>("blind-manager")!;
    _economyManager = engine.getPlugin<EconomyManagerPlugin>("economy")!;

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
    console.log("cuurent state", _phase);
    console.log("handle event", event, payload);
    _currentState.onEvent?.(event, payload);
  }

  function changePhase(phase: Phase) {
    console.log("emitting phase changed", phase);
    _engine.emitEvent("phase-changed", { phase });
  }

  function startGame() {
    transitionTo("Start");
  }

  function returnMenu() {
    transitionTo("Menu");
  }

  function drawCards(count: number) {
    const cards = _deck.drawCards(count);
    for (const card of cards) {
      _hand.addToHand(card);
    }
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

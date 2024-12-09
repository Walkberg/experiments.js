import { CardRank, CardSuit, Deck, Hand, PokerCard } from "./balatro";
import { evaluatePokerHand } from "./hand-evaluator";
import { v4 as uuid } from "uuid";
import { HandManagerPlugin } from "./plugins/hand-manager-plugin";
import { ScoreManagerPlugin } from "./plugins";

export type EventName =
  | "change-phase"
  | "phase-changed"
  | "hand-play"
  | "hand-played"
  | "hand-discard"
  | "hand-discarded"
  | "card-play"
  | "card-played"
  | "card-discard"
  | "card-discarded"
  | "score-calculated"
  | "score-reset"
  | "phase-changed"
  | "played-card-reset"
  | "shop-rerolled"
  | "shop-item-bought"
  | "economy-updated"
  | "card-selected"
  | "card-unselected"
  | "buffon-added"
  | "buffon-removed"
  | "consumable-added"
  | "consumable-removed"
  | "consumable-used"
  | "hand-score-improved"
  | "achievement-unlocked";

export interface BalatroEngine {
  removePlugin: (modName: string) => void;
  emitEvent: (eventName: EventName, payload: any) => void;
  onEvent: (eventName: EventName, callback: EventCallback) => void;
  hasPlugin: (name: string) => boolean;
  registerPlugin: (mod: Plugin) => void;
  getPlugin: <T extends Plugin>(name: string) => T | null;
}

export interface Plugin {
  name: string;
  init: (engine: BalatroEngine) => void;
}

export type EventCallback = (payload: any) => void;

export function createBalatroEngine(): BalatroEngine {
  const plugins: Record<string, Plugin> = {};

  const eventListeners: Map<string, EventCallback[]> = new Map();

  function on(eventName: string, callback: EventCallback): void {
    if (!eventListeners.has(eventName)) {
      eventListeners.set(eventName, []);
    }

    eventListeners.get(eventName)!.push(callback);
  }

  function emit(eventName: string, payload: any): void {
    const listeners = eventListeners.get(eventName);
    if (listeners) {
      listeners.forEach((callback) => callback(payload));
    }
  }

  function hasPlugin(pluginName: string) {
    return pluginName in plugins;
  }

  function registerPlugin(plugin: Plugin) {
    if (!hasPlugin(plugin.name)) {
      plugins[plugin.name] = plugin;
      plugin.init(engine);
    }
  }

  function removePlugin(modName: string) {
    if (hasPlugin(modName)) {
      delete plugins[modName];
    }
  }

  function getPlugin<T extends Plugin>(pluginName: string): T | null {
    return (plugins[pluginName] as T) || null;
  }

  const engine: BalatroEngine = {
    hasPlugin: hasPlugin,
    registerPlugin: registerPlugin,
    removePlugin: removePlugin,
    onEvent: on,
    emitEvent: emit,
    getPlugin,
  };

  return engine;
}

export function getPlayerManagerPlugin(
  engine: BalatroEngine
): PlayerManagerPlugin {
  const test = engine.getPlugin<PlayerManagerPlugin>("player-manager");

  if (test == null) {
    throw new Error("Player manager plugin not found");
  }

  return test;
}

export interface DeckManagerPlugin extends Plugin {
  generateDeck: () => void;
  getDeckSize: () => number;
  drawCard: () => PokerCard | null;
  drawCards: (count: number) => PokerCard[];
  shuffle: () => void;
  addCard: (card: PokerCard) => void;
  removeCard: (cardId: string) => boolean;
}

export function createDeckPlugin(): DeckManagerPlugin {
  let _deck: Deck = [];

  function generateDeck() {
    const suits: CardSuit[] = ["hearts", "diamonds", "clubs", "spades"];
    const ranks: CardRank[] = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];

    let deck: Deck = [];

    suits.forEach((suit) => {
      ranks.forEach((rank) => {
        deck.push({
          suit,
          rank,
          id: uuid(),
          enhancement: "none",
          edition: "base",
          seal: "none",
        });
      });
    });

    _deck = deck;

    shuffle();
  }

  function shuffle() {
    for (let i = _deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [_deck[i], _deck[j]] = [_deck[j], _deck[i]];
    }
    _deck;
  }

  function init(engine: BalatroEngine) {
    console.log("Deck plugin initialized");
  }

  function drawCard(): PokerCard | null {
    return _deck.pop() || null;
  }

  function drawCards(count: number): PokerCard[] {
    const hand: PokerCard[] = [];

    for (let i = 0; i < count; i++) {
      const card = drawCard();
      if (card) {
        hand.push(card);
      }
    }
    return hand;
  }

  function addCard(card: PokerCard) {
    _deck.push(card);
  }

  function removeCard(cardId: string): boolean {
    const index = _deck.findIndex((card) => card.id === cardId);
    if (index !== -1) {
      _deck.splice(index, 1);
      return true;
    }
    return false;
  }

  return {
    name: "deck",
    init,
    generateDeck,
    drawCard,
    drawCards,
    shuffle,
    addCard,
    removeCard,
    getDeckSize: () => _deck.length,
  };
}

export interface PlayedCardManagerPlugin extends Plugin {
  reset: () => void;
  addToHand: (card: PokerCard) => void;
  getHand: () => Hand;
}

export function createPlayedCardPlugin(): PlayedCardManagerPlugin {
  let _engine: BalatroEngine;
  let _hand: Hand = [];

  function init(engine: BalatroEngine) {
    _engine = engine;
    console.log("Hand plugin initialized");
  }

  function addToHand(card: PokerCard) {
    console.log("Adding card to hand");
    _hand.push(card);
  }

  function getHand(): PokerCard[] {
    return [..._hand];
  }

  function reset() {
    _hand = [];
    console.log("Hand reset");
    _engine.emitEvent("played-card-reset", {});
  }

  return {
    name: "played-card",
    init,
    addToHand,
    getHand,
    reset,
  };
}

export type Phase = "Pause" | "Play" | "Score" | "Shop" | "GameOver";

export interface GameManagerPlugin extends Plugin {
  getPhase: () => Phase;
  startGame: () => void;
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

  function init(engine: BalatroEngine) {
    _engine = engine;
    const deck = engine.getPlugin<DeckManagerPlugin>("deck");
    const hand = engine.getPlugin<HandManagerPlugin>("hand");
    const playedCard = engine.getPlugin<PlayedCardManagerPlugin>("played-card");
    const score = engine.getPlugin<ScoreManagerPlugin>("score");
    const blind = engine.getPlugin<BlindManagerPlugin>("blind-manager");
    const economyManager = engine.getPlugin<EconomyManagerPlugin>("economy");

    if (deck && hand && playedCard && score && blind && economyManager) {
      _deck = deck;
      _hand = hand;
      _playedCard = playedCard;
      _score = score;
      _blind = blind;
      _economyManager = economyManager;
    }

    _economyManager.addMoney(38);

    engine.onEvent("hand-played", playHand);

    engine.onEvent("hand-discarded", () => drawCards(5));

    engine.onEvent("score-calculated", (event) => {
      if (blind == null || score == null || hand == null) return;

      if (score.getRoundScore() < blind.getCurrentBlind().amount) {
        if (hand.getRemainingHands() === 0) {
          changePhase("GameOver");
        } else {
          endTurn();
        }
      } else {
        goToShop();
      }
    });
  }

  function changePhase(phase: Phase) {
    _phase = phase;
    _engine.emitEvent("phase-changed", { phase });
  }

  function goToShop() {
    setTimeout(() => {
      changePhase("Shop");
      _playedCard.reset();
    }, 1000);
  }

  function endTurn() {
    setTimeout(() => {
      changePhase("Play");
      _playedCard.reset();
      drawCards(5);
    }, 1000);
  }

  function playHand(hand: Hand) {
    for (const card of hand) {
      _playedCard.addToHand(card);
    }

    changePhase("Score");

    _score.calculateScore();
  }

  function startGame() {
    changePhase("Play");

    _deck.generateDeck();

    drawCards(8);
  }

  function startNextPhase() {
    changePhase("Play");

    _deck.generateDeck();
    _hand.reset();
    _score.resetScore();
    _playedCard.reset();

    drawCards(8);
  }

  function drawCards(count: number) {
    const cards = _deck.drawCards(count);

    for (const card of cards) {
      _hand.addToHand(card);
    }
  }

  return {
    name: "game",
    init,
    startGame,
    endTurn: () => console.log("Turn ended"),
    getPhase: () => _phase,
    startNextPhase,
  };
}

export interface Blind {
  id: string;
  amount: number;
  description?: string;
}

export interface BlindManagerPlugin extends Plugin {
  getCurrentBlind: () => Blind;
}

export function createBlindManagerPlugin(): BlindManagerPlugin {
  let currentBlind: Blind;

  function init(engine: BalatroEngine) {
    currentBlind = {
      id: "1",
      amount: 100,
      description: "Blind",
    };
    console.log("BlindManagerPlugin initialized");
  }

  return {
    name: "blind-manager",
    init,
    getCurrentBlind: () => currentBlind,
  };
}

export interface PlayerConfig {
  maxHandSize: number;
  maxHandCount: number;
  maxDiscard: number;
}

export interface PlayerManagerPlugin extends Plugin {
  addMaxHandCount: (size: number) => void;
  removeMaxHandCount: (size: number) => void;
  getMaxHandSize: () => number;
  getMaxHandCount: () => number;
  getMaxDiscard: () => number;
}

export function createPlayerManagerPlugin(): PlayerManagerPlugin {
  let _engine: BalatroEngine;

  let _maxHandSize: number = 8;
  let _maxHandCount: number = 4;
  let _maxDiscard: number = 4;

  function init(engine: BalatroEngine) {
    _engine = engine;
  }

  function addMaxHandCount(size: number) {
    _maxHandCount += size;
  }

  function removeMaxHandCount(size: number) {
    _maxHandCount -= size;
  }

  function getMaxHandSize() {
    return _maxHandSize;
  }

  function getMaxHandCount() {
    return _maxHandCount;
  }

  function getMaxDiscard() {
    return _maxDiscard;
  }

  return {
    name: "player-manager",
    init,
    addMaxHandCount,
    removeMaxHandCount,
    getMaxHandSize,
    getMaxHandCount,
    getMaxDiscard,
  };
}

export interface EconomyManagerPlugin extends Plugin {
  getMoney: () => number;
  addMoney: (amount: number) => void;
  removeMoney: (amount: number) => void;
}

export function createEconomyManagerPlugin(): EconomyManagerPlugin {
  let _engine: BalatroEngine;
  let _money: number = 0;

  function init(engine: BalatroEngine) {
    _engine = engine;
    console.log("Economy plugin initialized with money:", _money);
  }

  function getMoney() {
    return _money;
  }

  function addMoney(amount: number) {
    if (amount < 0) {
      console.warn("Cannot add a negative amount of money.");
      return;
    }

    updateAmount(amount);
  }

  function removeMoney(amount: number) {
    if (amount < 0) {
      console.warn("Cannot remove a negative amount of money.");
    }
    if (_money < amount) {
      console.warn("Insufficient funds: Cannot remove money.");
    }

    updateAmount(-amount);
  }

  function updateAmount(amount: number) {
    _money += amount;
    _engine.emitEvent("economy-updated", {});
  }

  return {
    name: "economy",
    init,
    getMoney,
    addMoney,
    removeMoney,
  };
}

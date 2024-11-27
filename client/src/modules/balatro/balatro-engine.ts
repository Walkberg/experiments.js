import {
  CardRank,
  CardSuit,
  Deck,
  getBaseChip,
  Hand,
  PokerCard,
} from "./balatro";

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
  | "phase-changed"
  | "played-card-reset"
  | "card-selected";

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
          id: `${suit}-${rank}`,
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

export interface HandManagerPlugin extends Plugin {
  addToHand: (card: PokerCard) => void;
  getHand: () => Hand;
  playHand: (cardIds: string[]) => void;
  discardHand: (cardIds: string[]) => void;
  getRemainingHandSize: () => number;
  getRemainingHands: () => number;
  getRemainingDiscards: () => number;
  reset: () => void;
}

export function createHandPlugin(): HandManagerPlugin {
  let _engine: BalatroEngine;
  let _hand: Hand = [];

  // TODO: Move to Player config
  const _maxHandSize = 7;
  const _maxHand = 2;
  const _maxDiscard = 2;

  let _remainingHandSize = _maxHandSize;
  let _remainingHand = _maxHand;
  let _remainingDiscard = _maxDiscard;

  function init(engine: BalatroEngine) {
    _engine = engine;
    console.log("Hand plugin initialized");
  }

  function addToHand(card: PokerCard) {
    _hand.push(card);
  }

  function removeFromHand(cardId: string): boolean {
    const index = _hand.findIndex((c) => c.id === cardId);
    if (index !== -1) {
      _hand.splice(index, 1);
      return true;
    }
    return false;
  }

  function getHand(): PokerCard[] {
    return [..._hand];
  }

  function playHand(cardIds: string[]) {
    _engine.emitEvent("hand-play", {});

    const cardPlayed = _hand.filter((c) => cardIds.includes(c.id));

    for (const cardId of cardIds) {
      _engine.emitEvent("card-play", { cardId });
      removeFromHand(cardId);
      _engine.emitEvent("card-played", { cardId });
    }

    _remainingHand--;

    _engine.emitEvent("hand-played", cardPlayed);
  }

  function discardHand(cardIds: string[]) {
    _engine.emitEvent("hand-discard", {});

    for (const cardId of cardIds) {
      _engine.emitEvent("card-discard", { cardId });
      removeFromHand(cardId);
      _engine.emitEvent("card-discarded", { cardId });
    }

    _remainingDiscard--;

    _engine.emitEvent("hand-discarded", {});
  }

  function reset() {
    _hand = [];
    _remainingHandSize = _maxHandSize;
    _remainingHand = _maxHand;
    _remainingDiscard = _maxDiscard;
  }

  return {
    name: "hand",
    init,
    addToHand,
    getHand,
    playHand,
    discardHand,
    getRemainingHandSize: () => _remainingHandSize,
    getRemainingHands: () => _remainingHand,
    getRemainingDiscards: () => _remainingDiscard,
    reset,
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

interface Score {
  chip: number;
  multiplier: number;
}

export interface ScoreManagerPlugin extends Plugin {
  getScore: () => Score;
  getRoundScore: () => number;
  calculateScore: () => void;
  resetScore: () => void;
}

export function createScorePlugin(): ScoreManagerPlugin {
  let _engine: BalatroEngine;
  let _playedCard: PlayedCardManagerPlugin;

  const baseChip = 10;
  const baseMultiplier = 10;

  let roundScore = 0;

  let currentChip = 0;
  let currentMultiplier = 0;

  function init(engine: BalatroEngine) {
    _engine = engine;
    const playedCard = engine.getPlugin<PlayedCardManagerPlugin>("played-card");

    if (playedCard) {
      _playedCard = playedCard;
    }
  }

  function calculateScore() {
    currentChip = baseChip;
    currentMultiplier = baseMultiplier;

    for (const card of _playedCard.getHand()) {
      currentChip += getBaseChip(card);
    }

    roundScore += currentChip * currentMultiplier;

    _engine.emitEvent("score-calculated", {
      chip: currentChip,
      multiplier: currentMultiplier,
    });
  }

  function resetScore() {
    currentChip = baseChip;
    currentMultiplier = baseMultiplier;
  }

  return {
    name: "score",
    init,
    getRoundScore: () => roundScore,
    getScore: () => ({ chip: currentChip, multiplier: currentMultiplier }),
    calculateScore,
    resetScore,
  };
}

export type Phase = "Pause" | "Play" | "Score" | "Shop";

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

  let _phase: Phase = "Pause";

  function init(engine: BalatroEngine) {
    _engine = engine;
    const deck = engine.getPlugin<DeckManagerPlugin>("deck");
    const hand = engine.getPlugin<HandManagerPlugin>("hand");
    const playedCard = engine.getPlugin<PlayedCardManagerPlugin>("played-card");
    const score = engine.getPlugin<ScoreManagerPlugin>("score");
    const blind = engine.getPlugin<BlindManagerPlugin>("blind-manager");

    if (deck && hand && playedCard && score && blind) {
      _deck = deck;
      _hand = hand;
      _playedCard = playedCard;
      _score = score;
      _blind = blind;
    }

    engine.onEvent("hand-played", playHand);

    engine.onEvent("hand-discarded", () => drawCards(5));

    engine.onEvent("score-calculated", (event) => {
      if (blind == null || score == null) return;

      if (score.getRoundScore() < blind.getCurrentBlind().amount) {
        endTurn();
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

    console.log("Score");

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
      amount: 400,
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

interface ShopPlugin extends Plugin {}

function createShopPlugin(): ShopPlugin {
  return { name: "shop", init: (engine) => {} };
}

interface BuffonPlugin extends Plugin {}

function createBuffonPlugin(): BuffonPlugin {
  return { name: "buffon", init: (engine) => {} };
}

interface PlayerPlugin extends Plugin {}

function createPlayerPlugin(): PlayerPlugin {
  return { name: "player", init: (engine) => {} };
}

interface ItemPlugin extends Plugin {}

function createItemPlugin(): ItemPlugin {
  return { name: "item", init: (engine) => {} };
}

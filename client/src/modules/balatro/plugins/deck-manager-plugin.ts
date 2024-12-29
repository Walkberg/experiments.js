import { v4 as uuid } from "uuid";
import { Deck } from "../balatro";
import { PokerCard, CardSuit, CardRank } from "../cards/poker-cards";
import { BalatroEngine, PlayerManagerPlugin, Plugin } from "../balatro-engine";
import { getSeedManagerPlugin, SeedManagerPlugin } from "./seed-manager-plugin";
import { getHandManagerPlugin, HandManagerPlugin } from "./hand-manager-plugin";

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
  getFullDeck: () => Deck;
  getCurrentDeck: () => Deck;
  drawCard: () => PokerCard | null;
  drawCards: (count: number) => PokerCard[];
  shuffle: () => void;
  addCard: (card: PokerCard) => void;
  removeCard: (cardId: string) => boolean;
  resetDeck: () => void;
}

export function createDeckPlugin(): DeckManagerPlugin {
  let _engine: BalatroEngine;
  let _seedManagerPlugin: SeedManagerPlugin;

  let _deck: Deck = [];
  let _hand: PokerCard[] = [];
  let _discard: PokerCard[] = [];

  function generateDeck() {
    _deck = generateBasicDeck();

    shuffle();

    _engine.emitEvent("deck-generated", { deck: _deck });
  }

  function shuffle() {
    for (let i = _deck.length - 1; i > 0; i--) {
      const j = Math.floor(_seedManagerPlugin.random() * (i + 1));
      [_deck[i], _deck[j]] = [_deck[j], _deck[i]];
    }
  }

  function init(engine: BalatroEngine) {
    _engine = engine;
    _seedManagerPlugin = getSeedManagerPlugin(engine);

    engine.onEvent("card-discarded", (payload) => {
      _hand = _hand.filter((card) => card.id !== payload.card.id);
      _discard.push(payload.card);
    });

    engine.onEvent("card-played", (payload) => {
      _hand = _hand.filter((card) => card.id !== payload.card.id);
    });
  }

  function reset() {
    console.log("reset deck", _deck, _discard);
    _deck = [..._deck, ..._hand, ..._discard];
    _discard = [];
    _hand = [];
    shuffle();

    _engine.emitEvent("deck-generated", { deck: _deck });
  }

  function drawCard(): PokerCard | null {
    return _deck.pop() || null;
  }

  function drawCards(count: number): PokerCard[] {
    const hand: PokerCard[] = [];

    for (let i = 0; i < count; i++) {
      const card = drawCard();
      if (card != null) {
        hand.push(card);
        _hand.push(card);
      }
    }

    _engine.emitEvent("deck-generated", { deck: _deck });
    return hand;
  }

  function addCard(card: PokerCard) {
    _deck.push(card);
    _engine.emitEvent("deck-generated", { deck: _deck });
  }

  function removeCard(cardId: string): boolean {
    const index = _deck.findIndex((card) => card.id === cardId);
    if (index !== -1) {
      _deck.splice(index, 1);
      return true;
    }
    return false;
  }

  function getDeckSize(): number {
    return _deck.length;
  }

  function getCurrentDeck(): Deck {
    return _deck;
  }

  function getFullDeck(): Deck {
    return [..._deck, ..._hand, ..._discard];
  }

  return {
    name: "deck",
    init,
    generateDeck,
    getCurrentDeck,
    getFullDeck,
    drawCard,
    drawCards,
    shuffle,
    addCard,
    removeCard,
    getDeckSize,
    resetDeck: reset,
  };
}

const ALL_SUITS: CardSuit[] = ["hearts", "diamonds", "clubs", "spades"];

const ALL_RANKS: CardRank[] = [
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

function generateBasicDeck() {
  const suits: CardSuit[] = ALL_SUITS;
  const ranks: CardRank[] = ALL_RANKS;

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
  return deck;
}

export function getDeckManagerPlugin(engine: BalatroEngine): DeckManagerPlugin {
  const deck = engine.getPlugin<DeckManagerPlugin>("deck");

  if (deck == null) {
    throw new Error("Deck manager plugin not found");
  }
  return deck;
}

export function createRandomPokerCard(): PokerCard {
  return {
    suit: ALL_SUITS[Math.floor(Math.random() * ALL_SUITS.length)],
    rank: ALL_RANKS[Math.floor(Math.random() * ALL_RANKS.length)],
    id: uuid(),
    enhancement: "mult",
    edition: "foil",
    seal: "none",
  };
}

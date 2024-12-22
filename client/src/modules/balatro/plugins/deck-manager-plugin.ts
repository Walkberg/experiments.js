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
}

export function createDeckPlugin(): DeckManagerPlugin {
  let _engine: BalatroEngine;
  let _seedManagerPlugin: SeedManagerPlugin;

  let _deck: Deck = [];
  let _hand: PokerCard[] = [];
  let _discard: PokerCard[] = [];

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
      _discard.push(payload.card);
    });

    engine.onEvent("card-played", (payload) => {
      _hand = _hand.filter((card) => card.id !== payload.card.id);
    });
  }

  function reset() {
    _deck = [..._deck, ..._discard];
    _discard = [];

    _engine.emitEvent("deck-generated", { deck: _deck });
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
        _hand.push(card);
      }
    }

    _engine.emitEvent("deck-generated", { deck: _deck });
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
  };
}

export function getDeckManagerPlugin(engine: BalatroEngine): DeckManagerPlugin {
  const deck = engine.getPlugin<DeckManagerPlugin>("deck");

  if (deck == null) {
    throw new Error("Deck manager plugin not found");
  }
  return deck;
}

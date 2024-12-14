import { v4 as uuid } from "uuid";
import { Deck } from "../balatro";
import { PokerCard, CardSuit, CardRank } from "../cards/poker-cards";
import { BalatroEngine, PlayerManagerPlugin, Plugin } from "../balatro-engine";

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
          enhancement: "bonus",
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

  function init(engine: BalatroEngine) {}

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

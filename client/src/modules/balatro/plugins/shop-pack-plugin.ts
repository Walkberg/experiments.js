import { Plugin } from "../balatro-engine";
import { BalatroEngine } from "../balatro-engine";
import { SeedManagerPlugin } from "./seed-manager-plugin";
import { createRandomPokerCard, PokerCard } from "../cards/poker-cards";
import { DeckManagerPlugin, getDeckManagerPlugin } from "./deck-manager-plugin";

export interface ShopPackPlugin extends Plugin {
  getCards: () => PokerCard[];
  skipCard: () => void;
  pickCard: (cardId: string) => void;
}

export function createShopPackPlugin(): ShopPackPlugin {
  let _engine: BalatroEngine;
  let _seedManager: SeedManagerPlugin;
  let _deck: DeckManagerPlugin;

  let _cards: PokerCard[] = [];

  function init(engine: BalatroEngine) {
    _engine = engine;
    _deck = getDeckManagerPlugin(engine);

    _cards = [
      createRandomPokerCard(),
      createRandomPokerCard(),
      createRandomPokerCard(),
      createRandomPokerCard(),
      createRandomPokerCard(),
    ];
  }

  function getCards() {
    return _cards;
  }

  function pickCard(cardId: string) {
    if (_cards.length === 0) {
      return;
    }
    const card = _cards.find((card) => card.id === cardId);

    if (card == null) {
      return;
    }

    console.log("card picked", card);

    _deck.addCard(card);

    _cards = _cards.filter((card) => card.id !== cardId);

    _engine.emitEvent("pack-pick", {});
  }

  function skipCard() {
    _engine.emitEvent("pack-skip", {});
  }

  return {
    name: "shop-pack",
    init,
    getCards,
    skipCard,
    pickCard,
  };
}

export function getShopPackPlugin(engine: BalatroEngine) {
  const deck = engine.getPlugin<ShopPackPlugin>("shop-pack");

  if (deck == null) {
    throw new Error("Deck manager plugin not found");
  }

  return deck;
}

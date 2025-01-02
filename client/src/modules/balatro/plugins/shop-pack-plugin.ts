import { Plugin } from "../balatro-engine";
import { BalatroEngine } from "../balatro-engine";
import { SeedManagerPlugin } from "./seed-manager-plugin";
import { createRandomPokerCard, PokerCard } from "../cards/poker-cards";
import { DeckManagerPlugin, getDeckManagerPlugin } from "./deck-manager-plugin";
import { CardPack } from "../balatro";
import { PokerCardPack } from "./consumables-manager-plugin";

export interface ShopPackPlugin extends Plugin {
  openPack: (pack: PokerCardPack) => void;
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

  function openPack(pack: PokerCardPack) {
    _cards = pack.generateCards(_engine);
  }

  return {
    name: "shop-pack",
    init,
    getCards,
    skipCard,
    pickCard,
    openPack,
  };
}

export function getShopPackPlugin(engine: BalatroEngine) {
  const deck = engine.getPlugin<ShopPackPlugin>("shop-pack");

  if (deck == null) {
    throw new Error("Deck manager plugin not found");
  }

  return deck;
}

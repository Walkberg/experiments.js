import { Hand } from "../balatro";
import {
  PokerCard,
  CardSuit,
  CardRank,
  EnhancementType,
} from "../cards/poker-cards";
import { BalatroEngine, PlayerManagerPlugin, Plugin } from "../balatro-engine";
import { getPlayerManagerPlugin } from "./deck-manager-plugin";

export interface HandManagerPlugin extends Plugin {
  addToHand: (card: PokerCard) => void;
  getHand: () => Hand;
  playHand: () => void;
  discardHand: () => void;
  getRemainingHandSize: () => number;
  getRemainingHands: () => number;
  getRemainingDiscards: () => number;
  selectCard: (cardId: string) => void;
  unSelectCard: (cardId: string) => void;
  getSelectedCards: () => Hand;
  upgradeCardValue: (cardId: string, cardRank: CardRank) => void;
  updateCardSuit: (cardId: string, cardSuit: CardSuit) => void;
  updateCardEnhancement: (
    cardId: string,
    enhancementType: EnhancementType
  ) => void;
  destroy: (cardId: string) => void;
  reset: () => void;
}

export function createHandPlugin(): HandManagerPlugin {
  let _engine: BalatroEngine;
  let _playerManagerPlugin: PlayerManagerPlugin;
  let _hand: Hand = [];

  let _selectedCards: PokerCard[] = [];

  let _remainingHandSize = 0;
  let _remainingHand = 0;
  let _remainingDiscard = 0;

  function init(engine: BalatroEngine) {
    _engine = engine;
    _playerManagerPlugin = getPlayerManagerPlugin(engine);

    reset();
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

  function playHand() {
    _engine.emitEvent("hand-play", {});

    for (const pokerCard of _selectedCards) {
      playCard(pokerCard);
    }

    _remainingHand--;

    _selectedCards = [];

    _engine.emitEvent("hand-played", _selectedCards);
  }

  function discardHand() {
    _engine.emitEvent("hand-discard", {});

    for (const pokerCard of _selectedCards) {
      discardCard(pokerCard);
    }

    _remainingDiscard--;

    _selectedCards = [];

    _engine.emitEvent("hand-discarded", {});
  }

  function playCard(pokerCard: PokerCard) {
    _engine.emitEvent("card-play", { cardId: pokerCard.id });
    removeFromHand(pokerCard.id);
    _engine.emitEvent("card-played", { cardId: pokerCard.id });
  }

  function discardCard(pokerCard: PokerCard) {
    _engine.emitEvent("card-discard", { cardId: pokerCard.id });
    removeFromHand(pokerCard.id);
    _engine.emitEvent("card-discarded", { cardId: pokerCard.id });
  }

  function reset() {
    _hand = [];
    _remainingHandSize = _playerManagerPlugin.getMaxHandSize();
    _remainingHand = _playerManagerPlugin.getMaxHandCount();
    _remainingDiscard = _playerManagerPlugin.getMaxDiscard();
  }

  function selectCard(cardId: string) {
    const card = _hand.find((c) => c.id === cardId);

    console.log("selectCard", card);

    if (card) {
      _selectedCards.push(card);
      _engine.emitEvent("card-selected", { cardId });
    }
  }

  function unSelectCard(cardId: string) {
    const card = _hand.find((c) => c.id === cardId);

    if (card) {
      _selectedCards = _selectedCards.filter((c) => c.id !== cardId);
      _engine.emitEvent("card-unselected", { cardId });
    }
  }

  function upgradeCardValue(cardId: string, cardRank: CardRank) {
    const card = _selectedCards.find((c) => c.id === cardId);

    if (card == null) {
      return;
    }

    card.rank = cardRank;

    _engine.emitEvent("card-upgraded", card);
  }

  function updateCardSuit(cardId: string, cardSuit: CardSuit) {
    const card = _selectedCards.find((c) => c.id === cardId);

    if (card == null) {
      return;
    }

    card.suit = cardSuit;

    _engine.emitEvent("card-upgraded", card);
  }

  function updateCardEnhancement(
    cardId: string,
    enhancementType: EnhancementType
  ) {
    const card = _selectedCards.find((c) => c.id === cardId);

    if (card == null) {
      return;
    }

    card.enhancement = enhancementType;

    _engine.emitEvent("card-upgraded", card);
  }

  function destroy(cardId: string) {
    const card = _hand.find((c) => c.id === cardId);
    if (card == null) {
      return;
    }
    _hand = _hand.filter((c) => c.id !== cardId);
    _engine.emitEvent("card-destroyed", { cardId });
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
    getSelectedCards: () => _selectedCards,
    selectCard,
    unSelectCard,
    upgradeCardValue,
    updateCardSuit,
    updateCardEnhancement,
    destroy,
  };
}

export function getHandManagerPlugin(engine: BalatroEngine): HandManagerPlugin {
  const plugin = engine.getPlugin<HandManagerPlugin>("hand");

  if (plugin == null) {
    throw new Error("Hand plugin not found");
  }
  return plugin;
}

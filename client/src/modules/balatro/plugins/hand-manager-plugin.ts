import { PokerCard, Hand } from "../balatro";
import {
  BalatroEngine,
  PlayerManagerPlugin,
  getPlayerManagerPlugin,
  Plugin,
} from "../balatro-engine";

export interface HandManagerPlugin extends Plugin {
  addToHand: (card: PokerCard) => void;
  getHand: () => Hand;
  playHand: (cardIds: string[]) => void;
  discardHand: (cardIds: string[]) => void;
  getRemainingHandSize: () => number;
  getRemainingHands: () => number;
  getRemainingDiscards: () => number;
  selectCard: (cardId: string) => void;
  unSelectCard: (cardId: string) => void;
  getSelectedCards: () => PokerCard[];
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
    _remainingHandSize = _playerManagerPlugin.getMaxHandSize();
    _remainingHand = _playerManagerPlugin.getMaxHandCount();
    _remainingDiscard = _playerManagerPlugin.getMaxDiscard();
  }

  function selectCard(cardId: string) {
    const card = _hand.find((c) => c.id === cardId);

    if (card) {
      _selectedCards.push(card);
    }
  }

  function unSelectCard(cardId: string) {
    const card = _hand.find((c) => c.id === cardId);

    if (card) {
      _selectedCards = _selectedCards.filter((c) => c.id !== cardId);
    }
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
  };
}

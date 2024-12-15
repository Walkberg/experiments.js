import { Hand } from "./balatro";
import { PokerCard } from "./cards/poker-cards";

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
  | "card-destroyed"
  | "card-upgraded"
  | "score-calculated"
  | "score-reset"
  | "phase-next"
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
  | "achievement-unlocked"
  | "score-card-calculated"
  | "blind-selected"
  | "seed-set"
  | "stats-updated";

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

export function getEconomyManagerPlugin(
  balatro: BalatroEngine
): EconomyManagerPlugin {
  const manager = balatro.getPlugin<EconomyManagerPlugin>("economy");

  if (!manager) {
    throw new Error("Economy manager plugin not found");
  }

  return manager;
}

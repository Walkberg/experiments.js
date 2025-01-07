import { v4 as uuid } from "uuid";
import { Card } from "./core/cards/card";

export type CardEffectType = "battlecry" | "deathrattle" | "taunt";

type CallbackType =
  | "card-attack"
  | "card-deathrattle"
  | "card-taunt"
  | "card-play"
  | "card-draw"
  | "card-discard"
  | "card-buy"
  | "card-sell";

export interface Pool {
  init: () => void;
  cards: Card[];
  removeCard: (cardId: string) => void;
  addCard: (card: Card, count: number) => void;
}

export interface Hand {
  getCards: () => Card[];
  maxHand: number;
  addCard: (card: Card) => void;
  playCard: (card: Card) => void;
}

export interface PlayerStats {
  health: number;
  money: number;
}

export interface Side {
  player: PlayerStats;
  board: Board;
  hand: Hand;
}

export interface Board {
  getCards: () => Card[];
  maxHand: number;
  addCard: (card: Card) => void;
  playCard: (card: Card) => void;
}

export interface Engine {
  hasPlugin: (modName: string) => boolean;
  registerPlugin: (mod: Plugin) => void;
  removePlugin: (modName: string) => void;
  emitEvent: (eventName: string, payload: any) => void;
  onEvent: (eventName: string, callback: EventCallback) => void;
  getPlugin: <T extends Plugin>(name: string) => T | null;
}

export interface Plugin {
  name: string;
  init: (engine: Engine) => void;
}

type EventCallback = (payload: any) => void;

export function createEngine(): Engine {
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

  const engine: Engine = {
    hasPlugin,
    registerPlugin,
    removePlugin,
    onEvent: on,
    emitEvent: emit,
    getPlugin,
  };

  return engine;
}

export function removeMod(modName: string, game: Engine): void {
  game.removePlugin(modName);
}

export function createBoard(game: Engine): Board {
  const cards: Card[] = [];
  return {
    getCards: () => cards,
    maxHand: 0,
    addCard: (card: Card) => {
      cards.push(card);
    },
    playCard: (card: Card) => {
      if (card.hasEffect("battlecry")) {
        // trigger battlr cry
      }

      console.log("after card play");
    },
  };
}

type ShopChangeCallback = () => void;

export function createHand(game: Engine): Hand {
  const maxHandSize = 3;
  let cards: Card[] = [];

  function removeCard(cardId: string) {
    cards = cards.filter((c) => c.id !== cardId);

    console.log("remove card", cards);
  }

  function playCard(card: Card) {
    const cardIndex = cards.findIndex((c) => c.id === card.id);

    if (cardIndex === -1) {
      console.error("Carte introuvable dans la main !");
      return;
    }

    const [removedCard] = cards.splice(cardIndex, 1);

    removeCard(card.id);

    game.emitEvent("cardPlayed", card);
  }

  function addCard(card: Card) {
    cards.push(card);
  }

  return {
    maxHand: 0,
    getCards: () => cards,
    addCard,
    playCard,
  };
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createPool(): Pool {
  const cards: Card[] = [];

  return {
    cards: cards,
    init: () => {},
    removeCard: (cardId: string) => {},
    addCard: (card: Card, count: number) => {
      for (let i = 0; i < count; i++) {
        cards.push(card);
      }
    },
  };
}

export interface Shop {
  removeCard: (cardId: string) => void;
  getCards: () => Card[];
  roll: () => void;
  freeze: () => void;
  buyCard: (card: Card) => void;
  onChange: (callback: ShopChangeCallback) => void;
}

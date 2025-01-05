import { BalatroEngine } from "../balatro-engine";
import { v4 as uuid } from "uuid";
import { Buyable } from "./cards";

export type EnhancementType =
  | "none"
  | "bonus"
  | "mult"
  | "wildcard"
  | "glass"
  | "steel"
  | "stone"
  | "gold"
  | "lucky";

export type EditionType =
  | "base"
  | "foil"
  | "holographic"
  | "polychrome"
  | "negative";

export type SealType = "none" | "gold" | "red" | "blue" | "purple";

export type CardSuit = "hearts" | "diamonds" | "clubs" | "spades";

export type CardRank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

export type Edition = { edition: EditionType };

export type Enhancement = { enhancement: EnhancementType };

export type Seal = { seal: SealType };

export type PokerCard = {
  id: string;
  type: "poker-card";
  suit: CardSuit;
  rank: CardRank;
} & Edition &
  Enhancement &
  Seal &
  Buyable;

export interface EnhancementTest {
  init(engine: BalatroEngine): void;
}

export interface EnhancementHandler {
  type: string;
  init: (balatroEngine: BalatroEngine) => void;
}

export class EnhancementManager {
  private handlers: Map<string, EnhancementHandler> = new Map();

  registerHandler(handler: EnhancementHandler) {
    this.handlers.set(handler.type, handler);
  }

  getHandler(type: string): EnhancementHandler | undefined {
    return this.handlers.get(type);
  }

  getHandlers(): EnhancementHandler[] {
    return Array.from(this.handlers.values());
  }
}

export interface EditionHandler {
  type: string;
  init: (balatroEngine: BalatroEngine) => void;
}

export class EditionManager {
  private handlers: Map<string, EditionHandler> = new Map();

  registerHandler(handler: EditionHandler) {
    this.handlers.set(handler.type, handler);
  }

  getHandler(type: string): EditionHandler | undefined {
    return this.handlers.get(type);
  }

  getHandlers(): EditionHandler[] {
    return Array.from(this.handlers.values());
  }
}

export interface SealHandler {
  type: string;
  init: (balatroEngine: BalatroEngine) => void;
}

export class SealManager {
  private handlers: Map<string, SealHandler> = new Map();

  registerHandler(handler: SealHandler) {
    this.handlers.set(handler.type, handler);
  }

  getHandler(type: string): SealHandler | undefined {
    return this.handlers.get(type);
  }

  getHandlers(): SealHandler[] {
    return Array.from(this.handlers.values());
  }
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

export function createRandomPokerCard(): PokerCard {
  function getBuyPrice(): number {
    return 1;
  }
  return {
    type: "poker-card",
    suit: ALL_SUITS[Math.floor(Math.random() * ALL_SUITS.length)],
    rank: ALL_RANKS[Math.floor(Math.random() * ALL_RANKS.length)],
    id: uuid(),
    enhancement: "mult",
    edition: "foil",
    seal: "none",
    getBuyPrice,
  };
}

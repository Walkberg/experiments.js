import { Plugin } from "../balatro-engine";
import { PokerCard } from "../cards/poker-cards";
import { BalatroEngine } from "../balatro-engine";

export type BuffonId = string;

export type BuffonRarity = "common" | "uncommon" | "rare" | "legendary";

export interface Buyable {
  getBuyPrice: () => number;
}

export interface Sellable {
  getSellPrice: () => number;
}

export type Buffon = {
  id: BuffonId;
  configId: string;
  name: string;
  description: string;
  rarity: BuffonRarity;
  onCardComputeScore: (ctx: BalatroEngine, card: PokerCard) => void;
  onBuffonEnabled: (ctx: BalatroEngine) => void;
  onBuffonDisabled: (ctx: BalatroEngine) => void;
} & Buyable &
  Sellable;

export interface BuffonsManagerPlugin extends Plugin {
  addBuffons: (buffons: Buffon[]) => void;
  addBuffon: (buffon: Buffon) => void;
  removeBuffon: (id: string) => void;
  canAddBuffon: () => boolean;
  getBuffons: () => Buffon[];
  setMaxCount: (maxCount: number) => void;
  getMaxCount: () => number;
  applyBuffonEffectCardPlay: (buffon: Buffon, card: PokerCard) => void;
}

export function createBuffonManagerPlugin(): BuffonsManagerPlugin {
  let _engine: BalatroEngine;
  let buffons: Buffon[] = [];
  let maxCount = 5;

  function init(engine: BalatroEngine) {
    _engine = engine;
  }

  function addBuffons(buffons: Buffon[]) {
    if (buffons.length >= maxCount) {
      return;
      console.warn("Cannot add Buffons: Max count reached");
    }
    for (const buffon of buffons) {
      addBuffon(buffon);
    }
  }

  function canAddBuffon() {
    return buffons.length < maxCount;
  }

  function addBuffon(buffon: Buffon) {
    if (!canAddBuffon()) {
      console.warn("Cannot add Buffon: Max count reached");
      return;
    }
    buffons.push(buffon);

    buffon.onBuffonEnabled(_engine);

    _engine.emitEvent("buffon-added", { buffon });
  }

  function removeBuffon(id: string) {
    const buffon = buffons.find((buffon) => buffon.id === id);

    if (buffon == null) {
      return;
    }

    buffons = buffons.filter((buffon) => buffon.id !== id);

    buffon.onBuffonDisabled(_engine);
  }

  function getBuffons() {
    return [...buffons];
  }

  function setMaxCount(newMaxCount: number) {
    maxCount = newMaxCount;
  }

  function getMaxCount() {
    return maxCount;
  }

  function applyBuffonEffectCardPlay(buffon: Buffon, pokerCard: PokerCard) {
    buffon.onCardComputeScore(_engine, pokerCard);
  }

  return {
    name: "buffon-manager",
    canAddBuffon,
    init,
    addBuffons,
    addBuffon,
    removeBuffon,
    getBuffons,
    setMaxCount,
    getMaxCount,
    applyBuffonEffectCardPlay,
  };
}

export function getBuffonManagerPlugin(
  balatro: BalatroEngine
): BuffonsManagerPlugin {
  const plugin = balatro.getPlugin<BuffonsManagerPlugin>("buffon-manager")!;

  if (plugin == null) {
    throw new Error("BuffonManagerPlugin not found");
  }
  return plugin;
}

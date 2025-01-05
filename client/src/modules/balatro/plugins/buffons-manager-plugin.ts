import { Plugin } from "../balatro-engine";
import { BalatroEngine } from "../balatro-engine";
import { BuffonCard } from "../cards/buffons";
import { PokerCard } from "../cards/poker-cards";
import {
  EconomyManagerPlugin,
  getEconomyManagerPlugin,
} from "./economy-manager-plugin";

export interface BuffonsManagerPlugin extends Plugin {
  addBuffons: (buffons: BuffonCard[]) => void;
  addBuffon: (buffon: BuffonCard) => void;
  removeBuffon: (id: string) => void;
  sellBuffon: (id: string) => void;
  canAddBuffon: () => boolean;
  getBuffons: () => BuffonCard[];
  setMaxCount: (maxCount: number) => void;
  getMaxCount: () => number;
  applyBuffonEffectCardPlay: (buffon: BuffonCard, card: PokerCard) => void;
}

export function createBuffonManagerPlugin(): BuffonsManagerPlugin {
  let _engine: BalatroEngine;
  let buffons: BuffonCard[] = [];
  let maxCount = 5;

  let _economyManager: EconomyManagerPlugin;

  function init(engine: BalatroEngine) {
    _engine = engine;
    _economyManager = getEconomyManagerPlugin(engine);
  }

  function addBuffons(buffons: BuffonCard[]) {
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

  function addBuffon(buffon: BuffonCard) {
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

    _engine.emitEvent("buffon-removed", { buffon });

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

  function applyBuffonEffectCardPlay(buffon: BuffonCard, pokerCard: PokerCard) {
    buffon.onCardComputeScore(_engine, pokerCard);
  }

  function sellBuffon(id: string) {
    const buffon = buffons.find((buffon) => buffon.id === id);

    if (buffon == null) {
      return;
    }
    removeBuffon(id);

    _economyManager.removeMoney(buffon.getSellPrice());
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
    sellBuffon,
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

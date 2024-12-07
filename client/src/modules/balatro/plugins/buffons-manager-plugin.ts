import { Plugin } from "../balatro-engine";
import { PokerCard } from "../balatro";
import { BalatroEngine } from "../balatro-engine";

export interface Buffon {
  id: string;
  name: string;
  description: string;
  onCardComputeScore: (ctx: BalatroEngine, card: PokerCard) => void;
  onBuffonEnabled: (ctx: BalatroEngine) => void;
  onBuffonDisabled: (ctx: BalatroEngine) => void;
}

export interface BuffonsManagerPlugin extends Plugin {
  addBuffons: (buffons: Buffon[]) => boolean;
  addBuffon: (buffon: Buffon) => boolean;
  removeBuffon: (id: string) => void;
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
      console.warn("Cannot add Buffons: Max count reached");
      return false;
    }
    for (const buffon of buffons) {
      addBuffon(buffon);
    }
    return true;
  }

  function addBuffon(buffon: Buffon) {
    if (buffons.length >= maxCount) {
      console.warn("Cannot add Buffon: Max count reached");
      return false;
    }
    buffons.push(buffon);

    buffon.onBuffonEnabled(_engine);

    _engine.emitEvent("buffon-added", { buffon });

    return true;
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

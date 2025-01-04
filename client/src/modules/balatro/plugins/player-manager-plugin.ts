import { Plugin, BalatroEngine } from "../balatro-engine";

export interface PlayerManagerPlugin extends Plugin {
  addMaxHandCount: (size: number) => void;
  removeMaxHandCount: (size: number) => void;
  addMaxDiscardCount: (size: number) => void;
  removeMaxDiscardCount: (size: number) => void;
  removeMaxHandSize: (size: number) => void;
  addMaxHandSize: (size: number) => void;
  getMaxHandSize: () => number;
  getMaxHandCount: () => number;
  getMaxDiscard: () => number;
}

export function createPlayerManagerPlugin(): PlayerManagerPlugin {
  let _engine: BalatroEngine;

  let _maxHandSize: number = 8;
  let _maxHandCount: number = 4;
  let _maxDiscard: number = 3;

  function init(engine: BalatroEngine) {
    _engine = engine;
  }

  function addMaxDiscardCount(size: number) {
    _maxDiscard += size;
    _engine.emitEvent("player-stats-updated", {});
  }

  function removeMaxDiscardCount(size: number) {
    _maxDiscard -= size;
    _engine.emitEvent("player-stats-updated", {});
  }

  function addMaxHandCount(size: number) {
    _maxHandCount += size;
    _engine.emitEvent("player-stats-updated", {});
  }

  function removeMaxHandCount(size: number) {
    _maxHandCount -= size;
    _engine.emitEvent("player-stats-updated", {});
  }

  function addMaxHandSize(size: number) {
    _maxHandSize += size;
    _engine.emitEvent("player-stats-updated", {});
  }

  function removeMaxHandSize(size: number) {
    _maxHandSize -= size;
    _engine.emitEvent("player-stats-updated", {});
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
    addMaxDiscardCount,
    removeMaxDiscardCount,
    addMaxHandCount,
    removeMaxHandCount,
    getMaxHandSize,
    getMaxHandCount,
    getMaxDiscard,
    addMaxHandSize,
    removeMaxHandSize,
  };
}

export function getPlayerManagerPlugin(context: BalatroEngine) {
  const manager = context.getPlugin<PlayerManagerPlugin>("player-manager");

  if (manager == null) {
    throw new Error("Player manager not found");
  }

  return manager;
}

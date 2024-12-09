import { Plugin } from "../balatro-engine";
import { BalatroEngine } from "../balatro-engine";

export interface ConsumablesManagerPlugin extends Plugin {
  addConsumables: (items: Consumable[]) => void;
  addConsumable: (item: Consumable) => void;
  removeConsumable: (id: string) => void;
  getConsumables: () => Consumable[];
  getLastConsumableUsed: () => Consumable | null;
  canAddConsumable: () => boolean;
  useConsumable: (id: string) => void;
  setMaxCount: (maxCount: number) => void;
  getMaxCount: () => number;
}

export type ConsumableType = "planet" | "tarot" | "pack" | "spectral";

export interface Consumable {
  id: string;
  name: string;
  type: ConsumableType;
  description: string;
  onConsumableUsed?: (ctx: BalatroEngine) => void;
}

export function createConsumableManagerPlugin(): ConsumablesManagerPlugin {
  const MAX_COUNT_START = 2;

  let _engine: BalatroEngine;
  let _consumables: Consumable[] = [];

  let _lastConsumableUsed: Consumable | null = null;

  let maxCount = MAX_COUNT_START;

  function init(engine: BalatroEngine) {
    _engine = engine;
  }

  function canAddConsumable() {
    return _consumables.length < maxCount;
  }

  function addConsumables(consumables: Consumable[]) {
    if (_consumables.length + consumables.length >= maxCount) {
      return;
    }
    for (const consumable of consumables) {
      addConsumable(consumable);
    }
    return true;
  }

  function addConsumable(consumable: Consumable) {
    if (!canAddConsumable()) {
      return;
    }

    _consumables.push(consumable);

    _engine.emitEvent("consumable-added", { item: consumable });
  }

  function removeConsumable(id: string) {
    const consumable = _consumables.find((consumable) => consumable.id === id);

    if (consumable == null) {
      return;
    }

    _consumables = _consumables.filter((item) => item.id !== id);

    _engine.emitEvent("consumable-removed", { item: consumable });
  }

  function useConsumable(id: string) {
    const consumable = _consumables.find((consumable) => consumable.id === id);
    if (consumable == null) {
      return;
    }

    removeConsumable(id);

    _engine.emitEvent("consumable-used", { item: consumable });

    if (consumable.onConsumableUsed != null) {
      consumable.onConsumableUsed(_engine);
    }

    _lastConsumableUsed = consumable;
  }

  function getLastConsumableUsed() {
    return _lastConsumableUsed;
  }

  function getConsumables() {
    return [..._consumables];
  }

  function setMaxCount(newMaxCount: number) {
    maxCount = newMaxCount;
  }

  function getMaxCount() {
    return maxCount;
  }

  return {
    name: "consumables-manager",
    getLastConsumableUsed,
    canAddConsumable,
    useConsumable,
    init,
    addConsumables,
    addConsumable,
    removeConsumable,
    getConsumables,
    setMaxCount,
    getMaxCount,
  };
}

export function getConsumablesPlugin(engine: BalatroEngine) {
  const consumableManager = engine.getPlugin<ConsumablesManagerPlugin>(
    "consumables-manager"
  );

  if (consumableManager == null) {
    throw new Error("Consumables manager plugin not found");
  }
  return consumableManager;
}

import { Plugin } from "../balatro-engine";
import { BalatroEngine } from "../balatro-engine";

export interface ItemsManagerPlugin extends Plugin {
  addItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  getItems: () => Item[];
  setMaxCount: (maxCount: number) => void;
  getMaxCount: () => number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
}

export function createItemsManagerPlugin(): ItemsManagerPlugin {
  const MAX_COUNT_START = 2;

  let _engine: BalatroEngine;
  let items: Item[] = [];

  let maxCount = MAX_COUNT_START;

  function init(engine: BalatroEngine) {
    _engine = engine;
  }

  function addItems(buffons: Item[]) {
    if (buffons.length >= maxCount) {
      return;
    }
    for (const buffon of buffons) {
      addItem(buffon);
    }
    return true;
  }

  function addItem(item: Item) {
    if (items.length >= maxCount) {
      return;
    }

    items.push(item);

    _engine.emitEvent("item-added", { item });
  }

  function removeItem(id: string) {
    const item = items.find((item) => item.id === id);

    if (item == null) {
      return;
    }

    items = items.filter((item) => item.id !== id);

    _engine.emitEvent("item-removed", { item });
  }

  function getItems() {
    return [...items];
  }

  function setMaxCount(newMaxCount: number) {
    maxCount = newMaxCount;
  }

  function getMaxCount() {
    return maxCount;
  }

  return {
    name: "items-manager",
    init,
    addItems,
    addItem: addItem,
    removeItem: removeItem,
    getItems,
    setMaxCount,
    getMaxCount,
  };
}

export function createBaseItem({
  name,
  description,
}: {
  name: string;
  description: string;
}): Item {
  return {
    id: name,
    name: name,
    description,
  };
}

export function createItem1(): Item {
  const item = createBaseItem({
    name: "planete_1",
    description: "ajoute une main",
  });

  return item;
}

export const itemsPlayer = [createItem1()];

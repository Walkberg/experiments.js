import { Buffon } from "./buffons-manager-plugin";
import { BalatroEngine, Plugin } from "../balatro-engine";
import { Item } from "./items-manager-plugin";

export interface PoolManagerPlugin extends Plugin {
  registerBuffon: (buffon: Buffon) => void;
  registerBuffons: (buffons: Buffon[]) => void;
  registerItem: (item: Item) => void;
  registerItems: (items: Item[]) => void;
  removeFromPool: (cardId: string) => void;
  getPool: () => Buffon[];
  getItemsPool: () => Item[];
  setupPool: (cards: Buffon[]) => void;
}

export function createPoolManagerPlugin(): PoolManagerPlugin {
  let pool: Buffon[] = [];
  let items: Item[] = [];

  function init(engine: BalatroEngine) {
    console.log("PoolManagerPlugin initialized");
  }

  function registerBuffon(buffon: Buffon) {
    pool.push(buffon);
  }

  function registerBuffons(buffons: Buffon[]) {
    for (const buffon of buffons) {
      registerBuffon(buffon);
    }
  }

  function registerItem(item: Item) {
    items.push(item);
  }

  function registerItems(items: Item[]) {
    for (const item of items) {
      registerItem(item);
    }
  }

  function removeFromPool(cardId: string) {
    pool = pool.filter((card) => card.id !== cardId);
  }

  function getPool() {
    return [...pool];
  }

  function setupPool(cards: Buffon[]) {
    pool = [...cards];
  }

  return {
    name: "pool-manager",
    init,
    registerBuffon,
    registerBuffons,
    registerItem,
    registerItems,
    removeFromPool,
    getPool,
    getItemsPool: () => items,
    setupPool,
  };
}

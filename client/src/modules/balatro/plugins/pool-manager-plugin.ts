import { Buffon } from "./buffons-manager-plugin";
import { BalatroEngine, Plugin } from "../balatro-engine";
import { Consumable } from "./consumables-manager-plugin";

export interface PoolManagerPlugin extends Plugin {
  registerBuffon: (buffon: Buffon) => void;
  registerBuffons: (buffons: Buffon[]) => void;
  registerItem: (item: Consumable) => void;
  registerItems: (items: Consumable[]) => void;
  removeFromPool: (cardId: string) => void;
  getPool: () => Buffon[];
  getConsumablePool: () => Consumable[];
  getRandomConsumables: (count: number) => Consumable[];
  setupPool: (cards: Buffon[]) => void;
}

export function createPoolManagerPlugin(): PoolManagerPlugin {
  let pool: Buffon[] = [];
  let items: Consumable[] = [];

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

  function registerItem(item: Consumable) {
    items.push(item);
  }

  function registerItems(items: Consumable[]) {
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

  function getRandomConsumables(count: number) {
    const consumables = [...items];
    const randomConsumables = [];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * consumables.length);
      const randomConsumable = consumables[randomIndex];
      randomConsumables.push(randomConsumable);
      consumables.splice(randomIndex, 1);
    }
    return randomConsumables;
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
    getConsumablePool: () => items,
    getRandomConsumables,
    setupPool,
  };
}

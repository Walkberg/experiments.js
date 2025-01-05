import { BalatroEngine, Plugin } from "../balatro-engine";
import { BuffonCard } from "../cards/buffons";
import { PokerCardPack } from "../cards/packs";
import { PlanetCard } from "../cards/planets";
import { TarotCard } from "../cards/tarots";
import { Consumable, ConsumableType } from "./consumables-manager-plugin";

export interface PoolManagerPlugin extends Plugin {
  registerBuffon: (buffon: BuffonCard) => void;
  registerBuffons: (buffons: BuffonCard[]) => void;
  registerItem: (item: Consumable) => void;
  registerItems: (items: Consumable[]) => void;
  removeFromPool: (cardId: string) => void;
  getPool: () => BuffonCard[];
  getConsumablePool: () => Consumable[];
  getRandomConsumables: (count: number, type?: ConsumableType) => Consumable[];
  getRandomConsumable: (type?: ConsumableType) => Consumable;
  getRandomBuffons: (count: number) => BuffonCard[];
  getRandomBuffon: () => BuffonCard;
  getRandomPlanet: () => PlanetCard;
  getRandomTarot: () => TarotCard;
  getRandomPack: () => PokerCardPack;
  setupPool: (cards: BuffonCard[]) => void;
}

export function createPoolManagerPlugin(): PoolManagerPlugin {
  let pool: BuffonCard[] = [];
  let items: Consumable[] = [];

  function init(engine: BalatroEngine) {}

  function registerBuffon(buffon: BuffonCard) {
    pool.push(buffon);
  }

  function registerBuffons(buffons: BuffonCard[]) {
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

  function setupPool(cards: BuffonCard[]) {
    pool = [...cards];
  }

  function getRandomConsumables(count: number, type?: ConsumableType) {
    const randomConsumables = [];

    for (let i = 0; i < count; i++) {
      const randomConsumable = getRandomConsumable(type);
      randomConsumables.push(randomConsumable);
    }
    return randomConsumables;
  }

  function getRandomConsumable(type?: ConsumableType) {
    const filteredConsumables = type
      ? items.filter((item) => item.type === type)
      : items;

    const randomIndex = Math.floor(Math.random() * filteredConsumables.length);
    const randomConsumable = filteredConsumables[randomIndex];

    filteredConsumables.splice(randomIndex, 1);

    return randomConsumable;
  }

  function getRandomPlanet(): PlanetCard {
    const filteredConsumables = items.filter((item) => item.type === "planet");

    const randomIndex = Math.floor(Math.random() * filteredConsumables.length);
    const randomConsumable = filteredConsumables[randomIndex];

    filteredConsumables.splice(randomIndex, 1);

    return randomConsumable;
  }

  function getRandomTarot(): TarotCard {
    const filteredConsumables = items.filter((item) => item.type === "tarot");

    const randomIndex = Math.floor(Math.random() * filteredConsumables.length);
    const randomConsumable = filteredConsumables[randomIndex];

    filteredConsumables.splice(randomIndex, 1);

    return randomConsumable;
  }

  function getRandomPack() {
    const filteredConsumables = items.filter((item) => item.type === "pack");

    const randomIndex = Math.floor(Math.random() * filteredConsumables.length);
    const randomConsumable = filteredConsumables[randomIndex];

    filteredConsumables.splice(randomIndex, 1);

    return randomConsumable;
  }

  function getRandomBuffons(count: number) {
    const randomBuffons = [];
    for (let i = 0; i < count; i++) {
      const randomBuffon = getRandomBuffon();
      randomBuffons.push(randomBuffon);
    }
    return randomBuffons;
  }

  function getRandomBuffon() {
    const randomIndex = Math.floor(Math.random() * pool.length);
    const randomBuffon = pool[randomIndex];
    //pool.splice(randomIndex, 1);
    return randomBuffon;
  }

  return {
    name: "pool-manager",
    init,
    registerBuffon,
    registerBuffons,
    registerItem,
    registerItems,
    removeFromPool,
    getRandomConsumable,
    getPool,
    getRandomBuffon,
    getConsumablePool: () => items,
    getRandomConsumables,
    setupPool,
    getRandomBuffons,
    getRandomPlanet,
    getRandomTarot,
    getRandomPack,
  };
}

export function getPoolManagerPlugin(engine: BalatroEngine): PoolManagerPlugin {
  const plugin = engine.getPlugin<PoolManagerPlugin>("pool-manager");

  if (plugin == null) {
    throw new Error("PoolManagerPlugin not found");
  }
  return plugin;
}

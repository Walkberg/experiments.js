import { Plugin } from "../balatro-engine";
import { BalatroEngine } from "../balatro-engine";
import { EconomyManagerPlugin } from "./economy-manager-plugin";
import { DeckManagerPlugin } from "./deck-manager-plugin";
import { Buffon, BuffonsManagerPlugin } from "./buffons-manager-plugin";
import {
  Consumable,
  ConsumablesManagerPlugin,
} from "./consumables-manager-plugin";
import { PoolManagerPlugin } from "./pool-manager-plugin";

export interface ShopPlugin extends Plugin {
  getItems: () => Buyable[];
  buyItem: (itemId: string) => void;
  addItem: (item: Buyable) => void;
  getRerollPrice: () => number;
  rerollShop: () => void;
  canReroll: () => boolean;
  canBuyItem: (itemId: string) => boolean;
}

export type Buyable = BuyableBuffon | BuyableConsumable;

export type BuyableBuffon = {
  type: "buffon";
  buffon: Buffon;
} & Price;

export type BuyableConsumable = {
  type: "consumable";
  item: Consumable;
} & Price;

interface Price {
  price: number;
}

export function createShopPlugin(): ShopPlugin {
  const REROLL_START_PRICE = 3;
  const BUFFON_PRICE = 5;

  let _engine: BalatroEngine;
  let _economy: EconomyManagerPlugin;
  let _deckManager: DeckManagerPlugin;
  let _poolManager: PoolManagerPlugin;
  let _buffonsManager: BuffonsManagerPlugin;
  let _consumablesManager: ConsumablesManagerPlugin;

  let _items: Buyable[] = [];
  let rerollPrice = REROLL_START_PRICE;

  function init(engine: BalatroEngine) {
    _engine = engine;

    const economy = engine.getPlugin<EconomyManagerPlugin>("economy");
    const deckManager = engine.getPlugin<DeckManagerPlugin>("deck");
    const poolManager = engine.getPlugin<PoolManagerPlugin>("pool-manager");
    const buffonManager =
      engine.getPlugin<BuffonsManagerPlugin>("buffon-manager");
    const itemsManager = engine.getPlugin<ConsumablesManagerPlugin>(
      "consumables-manager"
    );

    if (
      !economy ||
      !deckManager ||
      !poolManager ||
      !buffonManager ||
      !itemsManager
    ) {
      throw new Error("Economy or DeckManager plugin is missing.");
    }

    _economy = economy;
    _deckManager = deckManager;
    _poolManager = poolManager;
    _buffonsManager = buffonManager;
    _consumablesManager = itemsManager;

    resetShop();
  }

  function resetShop() {
    const buffons = _poolManager.getPool();

    const consumables = _poolManager.getRandomConsumables(2);

    const price = BUFFON_PRICE;

    const buyableBuffons: BuyableBuffon[] = buffons.map((buffon) => ({
      type: "buffon",
      buffon,
      price,
    }));

    const buyableConsumable: BuyableConsumable[] = consumables.map(
      (consumable) => ({
        type: "consumable",
        item: consumable,
        price,
      })
    );

    // _items = [...buyableBuffons, ...buyableConsumable];
    _items = [...buyableConsumable];
  }

  function canReroll() {
    return _economy.getMoney() >= rerollPrice;
  }

  function rerollShop() {
    if (!canReroll()) {
      return;
    }

    _economy.removeMoney(rerollPrice);

    resetShop();

    rerollPrice += 2;

    _engine.emitEvent("shop-rerolled", {});
  }

  function getItems(): Buyable[] {
    return [..._items];
  }

  function addItem(item: Buyable) {
    _items.push(item);
  }

  function getItem(itemId: string) {
    return _items.find((i) => getBuyableId(i) === itemId);
  }

  function canBuyItem(itemId: string) {
    const item = getItem(itemId);

    if (!item) {
      return false;
    }

    if (item.type === "consumable") {
      if (!_consumablesManager.canAddConsumable()) {
        return false;
      }
    } else {
      if (!_buffonsManager.canAddBuffon()) {
        return false;
      }
    }

    return item ? _economy.getMoney() >= item.price : false;
  }

  function buyItem(itemId: string) {
    const item = getItem(itemId);

    if (!item) {
      return;
    }

    if (!canBuyItem(itemId)) {
      return;
    }

    _economy.removeMoney(item.price);

    if (item.type === "buffon") {
      _buffonsManager.addBuffon(item.buffon);
    } else {
      _consumablesManager.addConsumable(item.item);
    }

    _items = _items.filter((i) => getBuyableId(i) !== itemId);

    _engine.emitEvent("shop-item-bought", { item });
  }

  return {
    name: "shop",
    init,
    getRerollPrice: () => rerollPrice,
    getItems,
    addItem,
    buyItem,
    rerollShop,
    canReroll,
    canBuyItem,
  };
}

function getBuyableId(buy: Buyable) {
  if (buy.type === "buffon") {
    return buy.buffon.id;
  } else {
    return buy.item.id;
  }
}

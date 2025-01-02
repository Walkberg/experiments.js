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
import { getSeedManagerPlugin, SeedManagerPlugin } from "./seed-manager-plugin";

export interface ShopPlugin extends Plugin {
  getItems: () => Buyable[];
  getPacks: () => Buyable[];
  buyItem: (itemId: string) => void;
  addItem: (item: Buyable) => void;
  getRerollPrice: () => number;
  rerollShop: () => void;
  canReroll: () => boolean;
  canBuyItem: (itemId: string) => boolean;
  resetShop: () => void;
  getPhase: () => ShopPhase;
  skipOpenPack: () => void;
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

export type ShopPhase = "buy" | "open-pack";

export function createShopPlugin(): ShopPlugin {
  const REROLL_START_PRICE = 3;
  const BUFFON_PRICE = 5;

  const _itemCount = 3;

  let _phase: ShopPhase = "buy";

  let _engine: BalatroEngine;
  let _economy: EconomyManagerPlugin;
  let _deckManager: DeckManagerPlugin;
  let _poolManager: PoolManagerPlugin;
  let _buffonsManager: BuffonsManagerPlugin;
  let _consumablesManager: ConsumablesManagerPlugin;
  let _seedManager: SeedManagerPlugin;

  let _items: Buyable[] = [];
  let _packs: Buyable[] = [];
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
    _seedManager = getSeedManagerPlugin(engine);

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

    _engine.onEvent("pack-skip", skipOpenPack);
    _engine.onEvent("pack-pick", skipOpenPack);

    resetShop();
  }

  function resetShop() {
    rerollPrice = REROLL_START_PRICE;

    let buyable: Buyable[] = [];

    for (let i = 0; i < _itemCount; i++) {
      buyable.push(generateItem());
    }

    let packs: Buyable[] = [];
    for (let i = 0; i < 2; i++) {
      packs.push(generatePack());
    }

    _items = buyable;
    _packs = packs;
  }

  function rerollItems() {
    let buyable: Buyable[] = [];

    for (let i = 0; i < _itemCount; i++) {
      buyable.push(generateItem());
    }

    _items = buyable;
  }

  function generateItem(): Buyable {
    const random = _seedManager.random() * 28;

    if (random < 20) {
      const card = _poolManager.getRandomBuffon();
      return {
        type: "buffon",
        buffon: card,
        price: BUFFON_PRICE,
      };
    } else if (random < 24) {
      const card = _poolManager.getRandomConsumable("planet");
      return {
        type: "consumable",
        item: card,
        price: BUFFON_PRICE,
      };
    } else {
      const card = _poolManager.getRandomConsumable("tarot");
      return {
        type: "consumable",
        item: card,
        price: BUFFON_PRICE,
      };
    }
  }

  function generatePack(): Buyable {
    const random = _seedManager.random() * 28;

    const card = _poolManager.getRandomConsumable("pack");
    return {
      type: "consumable",
      item: card,
      price: BUFFON_PRICE,
    };
  }

  function getPacks() {
    return _packs;
  }

  function canReroll() {
    return _economy.getMoney() >= rerollPrice;
  }

  function rerollShop() {
    if (!canReroll()) {
      return;
    }

    _economy.removeMoney(rerollPrice);

    rerollItems();

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
    return (
      _items.find((i) => getBuyableId(i) === itemId) ??
      _packs.find((i) => getBuyableId(i) === itemId)
    );
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
      if (item.item.type === "pack") {
        _phase = "open-pack";
      } else {
        _consumablesManager.addConsumable(item.item);
      }
    }

    _items = _items.filter((i) => getBuyableId(i) !== itemId);
    _packs = _packs.filter((i) => getBuyableId(i) !== itemId);

    _engine.emitEvent("shop-item-bought", { item });
  }

  function getPhase() {
    return _phase;
  }

  function skipOpenPack() {
    if (_phase !== "open-pack") {
      return;
    }
    _phase = "buy";
    _engine.emitEvent("shop-phase-changed", { phase: _phase });
  }

  return {
    name: "shop",
    init,
    getPacks,
    getRerollPrice: () => rerollPrice,
    getItems,
    addItem,
    buyItem,
    rerollShop,
    canReroll,
    canBuyItem,
    resetShop,
    getPhase,
    skipOpenPack,
  };
}

function getBuyableId(buy: Buyable) {
  if (buy.type === "buffon") {
    return buy.buffon.id;
  } else {
    return buy.item.id;
  }
}

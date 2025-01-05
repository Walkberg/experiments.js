import { Plugin } from "../balatro-engine";
import { BalatroEngine } from "../balatro-engine";
import { EconomyManagerPlugin } from "./economy-manager-plugin";
import { DeckManagerPlugin } from "./deck-manager-plugin";
import { BuffonsManagerPlugin } from "./buffons-manager-plugin";
import {
  Consumable,
  ConsumablesManagerPlugin,
} from "./consumables-manager-plugin";
import { PoolManagerPlugin } from "./pool-manager-plugin";
import { getSeedManagerPlugin, SeedManagerPlugin } from "./seed-manager-plugin";
import { getShopPackPlugin, ShopPackPlugin } from "./shop-pack-plugin";
import { BuffonCard } from "../cards/buffons";
import { TarotCard } from "../cards/tarots";
import { PlanetCard } from "../cards/planets";
import { PokerCardPack } from "../cards/packs";

export interface ShopPlugin extends Plugin {
  getItems: () => Buyable[];
  getPacks: () => PokerCardPack[];
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

export type Buyable = BuffonCard | TarotCard | PlanetCard | PokerCardPack;

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
  let _shopPackManager: ShopPackPlugin;

  let _items: Buyable[] = [];
  let _packs: PokerCardPack[] = [];
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
    _shopPackManager = getShopPackPlugin(engine);

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

    let packs: PokerCardPack[] = [];
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
      return card;
    } else if (random < 24) {
      return _poolManager.getRandomPlanet();
    } else {
      return _poolManager.getRandomTarot();
    }
  }

  function generatePack(): PokerCardPack {
    const random = _seedManager.random() * 28;

    return _poolManager.getRandomPack();
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

    if (item.type === "planet" || item.type === "tarot") {
      if (!_consumablesManager.canAddConsumable()) {
        return false;
      }
    } else {
      if (!_buffonsManager.canAddBuffon()) {
        return false;
      }
    }

    return item ? _economy.getMoney() >= item.getBuyPrice() : false;
  }

  function buyItem(itemId: string) {
    const item = getItem(itemId);

    if (!item) {
      return;
    }

    if (!canBuyItem(itemId)) {
      return;
    }

    _economy.removeMoney(item.getBuyPrice());

    if (item.type === "buffon") {
      _buffonsManager.addBuffon(item);
    } else {
      if (item.type === "pack") {
        _shopPackManager.openPack(item);
        _phase = "open-pack";
      } else {
        _consumablesManager.addConsumable(item);
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
    return buy.id;
  } else {
    return buy.id;
  }
}

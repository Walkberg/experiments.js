import { Card } from "../core/cards/card";
import { Plugin, Engine } from "../game";
import { EconomyPlugin } from "./economy-plugin";
import { PoolManagerPlugin } from "./pool-manager-plugin";

export interface ShopPlugin extends Plugin {
  roll: () => void;
  getCards: () => Card[];
  freeze: () => void;
  removeCard: (cardId: string) => void;
}

export function createShopPlugin(): ShopPlugin {
  let cards: Card[] = [];
  let _engine: Engine;

  const rollPrice = 1;

  const maxCardCount = 3;

  function init(engine: Engine): void {
    _engine = engine;
  }

  function createInitialCards(): Card[] {
    const pool = _engine.getPlugin<PoolManagerPlugin>("pool");
    if (pool == null) {
      return [];
    }
    return pool.getRandomCard(maxCardCount);
  }

  function roll(): void {
    const encomyPlugin = _engine.getPlugin<EconomyPlugin>("economy");
    if (encomyPlugin == null) {
      return;
    }

    const money = encomyPlugin?.getCurrentMoney();

    if (money == null || money - rollPrice < 0) {
      return;
    }

    cards = createInitialCards();

    encomyPlugin.addMoney(-rollPrice);

    _engine.emitEvent("shop-rolled", cards);
  }

  function freeze(): void {
    console.log("Shop frozen: cards will remain unchanged on next roll.");
  }

  function buyCard(cardId: string): void {
    const index = cards.findIndex((c) => c.id === cardId);
    const card = cards[index];
    if (index === -1) {
      return;
    }
    cards.splice(index, 1);

    _engine.emitEvent("card-bought", card);
  }

  function getCards(): Card[] {
    return cards;
  }

  return {
    name: "shop",
    init,
    roll,
    getCards,
    freeze,
    removeCard: buyCard,
  };
}

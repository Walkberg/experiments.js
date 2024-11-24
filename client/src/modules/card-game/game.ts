export interface Card {
  id: string;
  name: string;
  description: string;
  image: string;
  cost: number;
  attack: number;
  health: number;
  hasBattleCry: () => boolean;
  addBattleCry: (callback: (game: Engine) => void) => void;
  triggerBattleCry: (game: Engine) => void;
}

export type CardEffectType = "battlecry" | "deathrattle" | "taunt";

type CallbackType =
  | "card-attack"
  | "card-deathrattle"
  | "card-taunt"
  | "card-play"
  | "card-draw"
  | "card-discard"
  | "card-buy"
  | "card-sell";

export interface Pool {
  init: () => void;
  cards: Card[];
  removeCard: (cardId: string) => void;
  addCard: (card: Card, count: number) => void;
}

export interface Hand {
  getCards: () => Card[];
  maxHand: number;
  addCard: (card: Card) => void;
  playCard: (card: Card) => void;
}

export interface PlayerStats {
  health: number;
  money: number;
}

export interface Side {
  player: PlayerStats;
  board: Board;
  hand: Hand;
}

export interface Board {
  getCards: () => Card[];
  maxHand: number;
  addCard: (card: Card) => void;
  playCard: (card: Card) => void;
}

export interface Engine {
  hasPlugin: (modName: string) => boolean;
  registerPlugin: (mod: Plugin) => void;
  removePlugin: (modName: string) => void;
  emitEvent: (eventName: string, payload: any) => void;
  onEvent: (eventName: string, callback: EventCallback) => void;
  getPlugin: <T extends Plugin>(name: string) => T | null;
  pool: Pool;
}

export interface Plugin {
  name: string;
  init: (engine: Engine) => void;
}

type EventCallback = (payload: any) => void;

export function createEngine(): Engine {
  const plugins: Record<string, Plugin> = {};

  const pool = createPool();

  const eventListeners: Map<string, EventCallback[]> = new Map();

  function on(eventName: string, callback: EventCallback): void {
    if (!eventListeners.has(eventName)) {
      eventListeners.set(eventName, []);
    }

    eventListeners.get(eventName)!.push(callback);
  }

  function emit(eventName: string, payload: any): void {
    const listeners = eventListeners.get(eventName);
    if (listeners) {
      listeners.forEach((callback) => callback(payload));
    }
  }

  function hasPlugin(pluginName: string) {
    return pluginName in plugins;
  }

  function registerPlugin(plugin: Plugin) {
    if (!hasPlugin(plugin.name)) {
      plugins[plugin.name] = plugin;
      plugin.init(engine);
    }
  }

  function removePlugin(modName: string) {
    if (hasPlugin(modName)) {
      delete plugins[modName];
    }
  }

  function getPlugin<T extends Plugin>(pluginName: string): T | null {
    return (plugins[pluginName] as T) || null;
  }

  const engine: Engine = {
    pool,
    hasPlugin: hasPlugin,
    registerPlugin: registerPlugin,
    removePlugin: removePlugin,
    onEvent: on,
    emitEvent: emit,
    getPlugin,
  };

  return engine;
}

export function removeMod(modName: string, game: Engine): void {
  game.removePlugin(modName);
}

export function createBoard(game: Engine): Board {
  const cards = createCards(3);
  return {
    getCards: () => cards,
    maxHand: 0,
    addCard: (card: Card) => {
      cards.push(card);
    },
    playCard: (card: Card) => {
      if (card.hasBattleCry()) {
        card.triggerBattleCry(game);
      }

      console.log("after card play");
    },
  };
}

export function createSide(game: Engine): Side {
  return {
    player: {
      health: 0,
      money: 0,
    },
    board: createBoard(game),
    hand: createHand(game),
  };
}

type ShopChangeCallback = () => void;

export function createHand(game: Engine): Hand {
  let cards = game.pool.cards;

  function removeCard(cardId: string) {
    cards = cards.filter((c) => c.id !== cardId);

    console.log("remove card", cards);
  }

  function playCard(card: Card) {
    const cardIndex = cards.findIndex((c) => c.id === card.id);

    if (cardIndex === -1) {
      console.error("Carte introuvable dans la main !");
      return;
    }

    const [removedCard] = cards.splice(cardIndex, 1);

    removeCard(card.id);

    //game.playerSide.board.addCard(removedCard);

    if (card.hasBattleCry()) {
      card.triggerBattleCry(game);
    }

    game.emitEvent("cardPlayed", card);
  }

  return {
    maxHand: 0,
    getCards: () => cards,
    addCard: (card: Card) => {},
    playCard,
  };
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createPool(): Pool {
  const cards: Card[] = [];

  return {
    cards: cards,
    init: () => {},
    removeCard: (cardId: string) => {},
    addCard: (card: Card, count: number) => {
      for (let i = 0; i < count; i++) {
        cards.push(card);
      }
    },
  };
}

export function createCards(count: number): Card[] {
  const cards: Card[] = [];

  for (let i = 0; i < count; i++) {
    cards.push(createCard());
  }
  return cards;
}

export function createCard(): Card {
  const i = Math.floor(Math.random() * 100);

  let battleCryCallback: (game: Engine) => void;

  function addBattleCry(callback: (game: Engine) => void) {
    console.log("addBattleCry cb", i, callback);
    battleCryCallback = callback;
  }

  function triggerBattleCry(game: Engine) {
    console.log("triggerBattleCry");
    if (hasBattleCry()) {
      battleCryCallback(game);
    }
  }

  function hasBattleCry() {
    return battleCryCallback != null;
  }

  return {
    id: i.toString(),
    name: "Card " + i,
    description: "Description " + i,
    image: "https://via.placeholder.com/150",
    cost: i,
    attack: i,
    health: i,
    hasBattleCry,
    addBattleCry,
    triggerBattleCry,
  };
}

export interface Shop {
  removeCard: (cardId: string) => void;
  getCards: () => Card[];
  roll: () => void;
  freeze: () => void;
  buyCard: (card: Card) => void;
  onChange: (callback: ShopChangeCallback) => void;
}

export interface ShopPlugin extends Plugin {
  roll: () => void;
  getCards: () => Card[];
  freeze: () => void;
  removeCard: (cardId: string) => void;
}

export function createShopPlugin(): ShopPlugin {
  let cards: Card[] = [];
  let _engine: Engine;

  function init(engine: Engine): void {
    _engine = engine;
  }

  function createInitialCards(): Card[] {
    return createCards(randomNumber(1, 5));
  }

  function roll(): void {
    cards = createInitialCards();

    _engine.emitEvent("shop-rolled", cards);
  }

  function freeze(): void {
    console.log("Shop frozen: cards will remain unchanged on next roll.");
  }

  function buyCard(cardId: string): void {
    const index = cards.findIndex((c) => c.id === cardId);
    if (index === -1) {
      return;
    }
    cards.splice(index, 1);

    _engine.emitEvent("card-bought", {});
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

export interface PlayerPlugin extends Plugin {
  getPlayerStats: () => PlayerStats;
  setPlayerStats: (stats: Partial<PlayerStats>) => void;
  getPlayerSide: () => Side;
}

export function createPlayerPlugin(): PlayerPlugin {
  let _engine: Engine;
  let playerStats: PlayerStats = {
    health: 30,
    money: 0,
  };

  let playerSide: Side;

  function init(engine: Engine): void {
    _engine = engine;

    playerSide = {
      player: playerStats,
      board: createBoard(engine),
      hand: createHand(engine),
    };
  }

  function getPlayerStats(): PlayerStats {
    return playerStats;
  }

  function setPlayerStats(stats: Partial<PlayerStats>): void {
    playerStats = { ...playerStats, ...stats };
  }

  function getPlayerSide(): Side {
    return playerSide;
  }

  return {
    name: "player",
    init,
    getPlayerStats,
    setPlayerStats,
    getPlayerSide,
  };
}

interface Opponent {
  id: string;
  name: string;
}

export interface OpponentsPlugin extends Plugin {
  getOpponents: () => Opponent[];
}

interface OpponentPluginOptions {
  count: number;
}

export function createOpponentPlugin(
  args?: OpponentPluginOptions
): OpponentsPlugin {
  let _engine: Engine;

  let opponents: Opponent[];

  function init(engine: Engine): void {
    _engine = engine;
    opponents = createOpponents(args?.count ?? 8);
  }

  function createOpponents(count: number): Opponent[] {
    return Array.from({ length: count }, (_, i) => createOpponent(i));
  }

  function createOpponent(i: number): Opponent {
    return {
      id: i.toString(),
      name: `Opponent ${i + 1}`,
    };
  }

  function getOpponents(): Opponent[] {
    return opponents;
  }

  return {
    name: "opponents",
    init,
    getOpponents,
  };
}

export interface EconomyPlugin extends Plugin {
  getMoney: () => number;
  addMoney: (amount: number) => void;
  deductMoney: (amount: number) => boolean;
  setMoney: (amount: number) => void;
}

export function createEconomyPlugin(initialMoney: number = 10): EconomyPlugin {
  let _engine: Engine;
  let money: number = initialMoney;

  function init(engine: Engine): void {
    _engine = engine;

    _engine.onEvent("money-added", (payload) => {
      console.log(`Money added: ${payload.amount}`);
    });

    _engine.onEvent("money-deducted", (payload) => {
      console.log(`Money deducted: ${payload.amount}`);
    });
  }

  function getMoney(): number {
    return money;
  }

  function addMoney(amount: number): void {
    if (amount < 0) {
      console.warn("Cannot add a negative amount of money!");
      return;
    }
    money += amount;

    _engine.emitEvent("money-added", { amount, total: money });
  }

  function deductMoney(amount: number): boolean {
    if (amount < 0) {
      console.warn("Cannot deduct a negative amount of money!");
      return false;
    }
    if (money < amount) {
      console.warn("Not enough money to deduct!");
      return false;
    }
    money -= amount;

    _engine.emitEvent("money-deducted", { amount, total: money });

    return true;
  }

  function setMoney(amount: number): void {
    if (amount < 0) {
      return;
    }
    money = amount;

    _engine.emitEvent("money-set", { total: money });
  }

  return {
    name: "economy",
    init,
    getMoney,
    addMoney,
    deductMoney,
    setMoney,
  };
}

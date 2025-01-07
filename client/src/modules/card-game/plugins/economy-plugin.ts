import { Plugin, Engine } from "../game";

export interface EconomyPlugin extends Plugin {
  getCurrentMoney: () => number;
  getMaxMoney: () => number;
  addMoney: (amount: number) => void;
  addMaxMoney: (amount: number) => void;
  deductMoney: (amount: number) => boolean;
  setMoney: (amount: number) => void;
  resetMoney: () => void;
}

export function createEconomyPlugin(initialMoney: number = 2): EconomyPlugin {
  let _engine: Engine;

  let money: number = initialMoney;
  let maxMoney: number = 3;

  function init(engine: Engine): void {
    _engine = engine;

    _engine.onEvent("money-added", (payload) => {
      console.log(`Money added: ${payload.amount}`);
    });

    _engine.onEvent("money-deducted", (payload) => {
      console.log(`Money deducted: ${payload.amount}`);
    });
  }

  function addMoney(amount: number): void {
    money += amount;

    _engine.emitEvent("money-added", { amount, total: money });
  }

  function addMaxMoney(amount: number): void {
    maxMoney += amount;

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

  function resetMoney(): void {
    money = maxMoney;
  }

  function getMaxMoney() {
    return maxMoney;
  }

  function getCurrentMoney() {
    return money;
  }

  return {
    name: "economy",
    init,
    addMaxMoney,
    getMaxMoney,
    getCurrentMoney,
    resetMoney,
    addMoney,
    deductMoney,
    setMoney,
  };
}

export const getEconomyPlugin = (engine: Engine) => {
  const plugin = engine.getPlugin<EconomyPlugin>("economy");

  if (!plugin) {
    throw new Error("Economy plugin not found");
  }
  return plugin;
};

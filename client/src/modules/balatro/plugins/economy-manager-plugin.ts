import { Plugin, BalatroEngine } from "../balatro-engine";

export interface EconomyManagerPlugin extends Plugin {
  getMoney: () => number;
  addMoney: (amount: number) => void;
  removeMoney: (amount: number) => void;
}

export function createEconomyManagerPlugin(): EconomyManagerPlugin {
  let _engine: BalatroEngine;
  let _money: number = 200;

  function init(engine: BalatroEngine) {
    _engine = engine;
  }

  function getMoney() {
    return _money;
  }

  function addMoney(amount: number) {
    if (amount < 0) {
      console.warn("Cannot add a negative amount of money.");
      return;
    }

    updateAmount(amount);
  }

  function removeMoney(amount: number) {
    if (amount < 0) {
      console.warn("Cannot remove a negative amount of money.");
    }
    if (_money < amount) {
      console.warn("Insufficient funds: Cannot remove money.");
    }

    updateAmount(-amount);
  }

  function updateAmount(amount: number) {
    _money += amount;
    _engine.emitEvent("economy-updated", {});
  }

  return {
    name: "economy",
    init,
    getMoney,
    addMoney,
    removeMoney,
  };
}

export function getEconomyManagerPlugin(
  balatro: BalatroEngine
): EconomyManagerPlugin {
  const manager = balatro.getPlugin<EconomyManagerPlugin>("economy");

  if (!manager) {
    throw new Error("Economy manager plugin not found");
  }

  return manager;
}

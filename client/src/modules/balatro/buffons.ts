import { PokerCard } from "./balatro";
import { BalatroEngine, getPlayerManagerPlugin } from "./balatro-engine";
import { ScoreManagerPlugin } from "./plugins";
import { createCallbackManager, getCallbackManager, Mod } from "./mod";
import { Buffon } from "./plugins/buffons-manager-plugin";

export type BuffonId = string;

export type Rarety = "common" | "uncommon" | "rare" | "legendary";

export type BuffonConfig = {
  id: BuffonId;
  name: string;
  rarety: Rarety;
  cost: number;
};

const buffon_1: BuffonConfig = {
  id: "b_flaviac",
  name: "Flaviac",
  rarety: "common",
  cost: 1,
};

const buffon_2: BuffonConfig = {
  id: "buffon_2",
  name: "Buffon 2",
  rarety: "common",
  cost: 5,
};

interface BuffonPool {
  getBuffon(): BuffonConfig[];

  addBuffon(...buffonsToAdd: BuffonConfig[]): void;

  removeBuffon(buffonToRemove: BuffonConfig): void;
}

export function createBuffonPool(): BuffonPool {
  const buffons: { [key: string]: BuffonConfig } = {};

  function addBuffon(...buffonsToAdd: BuffonConfig[]) {
    buffonsToAdd.forEach((buffon) => {
      buffons[buffon.id] = buffon;
    });
  }

  function getBuffon() {
    return Object.values(buffons);
  }

  function removeBuffon() {
    return Object.values(buffons);
  }

  return {
    addBuffon,
    getBuffon,
    removeBuffon,
  };
}

BuffonPool().addBuffon(buffon_1, buffon_2);

export function BuffonPool() {
  let pool;

  if (pool == null) {
    pool = createBuffonPool();
  }

  return pool;
}

interface BuffonEntity {
  id: BuffonId;
  name: string;
  rarety: Rarety;
  cost: number;
}

export interface IBalatro {
  GetBuffonIdByName(name: string): BuffonEntity;

  pickBuffon(): void;
}

export const Balatro: IBalatro = {
  GetBuffonIdByName: (name: string) => {
    const buffon = BuffonPool()
      .getBuffon()
      .find((buffon) => buffon.name === name);

    if (buffon == null) {
      throw new Error(`Buffon ${name} not found`);
    }
    return buffon;
  },

  pickBuffon: () => {
    console.log("pickBuffon");
    getCallbackManager().onGameEnd.notify();
  },
};

export function createBuffon1(): Buffon {
  const buffon = createBaseBuffon({
    name: "buffon_1",
    description: "add 10 multiplier when 10 is played",
  });

  buffon.onCardComputeScore = (context: BalatroEngine, card: PokerCard) => {
    const scoreManager = context.getPlugin<ScoreManagerPlugin>("score");

    if (scoreManager == null) {
      return;
    }

    if (card.rank === "10") {
      scoreManager.addMultiplier(20);
    }
  };

  return buffon;
}

export function createBuffon2(): Buffon {
  const buffon = createBaseBuffon({
    name: "buffon_2",
    description: "add 100 chips when a heart is played",
  });

  buffon.onCardComputeScore = (context: BalatroEngine, card: PokerCard) => {
    const scoreManager = context.getPlugin<ScoreManagerPlugin>("score");

    if (scoreManager == null) {
      return;
    }

    if (card.suit === "hearts") {
      scoreManager.addChip(100);
    }
  };

  return buffon;
}

function getScoreManagerPlugin(context: BalatroEngine) {
  return context.getPlugin<ScoreManagerPlugin>("score");
}

function getPlayerManagerPlugin(context: BalatroEngine) {
  const manager = context.getPlugin<ScoreManagerPlugin>("player");

  if (manager == null) {
    throw new Error("Player manager not found");
  }

  return manager;
}

export function createBuffon3(): Buffon {
  const buffon = createBaseBuffon({
    name: "buffon_3",
    description: "ajoute une main",
  });

  buffon.onBuffonEnabled = (context: BalatroEngine) => {
    console.log("buffon_3 enabled");
    const playerManagerPlugin = getPlayerManagerPlugin(context);
    playerManagerPlugin.addMaxHandCount(1);
  };

  buffon.onBuffonDisabled = (context: BalatroEngine) => {
    const playerManagerPlugin = getPlayerManagerPlugin(context);
    playerManagerPlugin.removeMaxHandCount(1);
  };

  return buffon;
}

export function createBaseBuffon({
  name,
  description,
}: {
  name: string;
  description: string;
}): Buffon {
  return {
    id: name,
    name: name,
    description,
    onCardComputeScore(context: BalatroEngine, card: PokerCard) {},
    onBuffonEnabled(context: BalatroEngine) {},
    onBuffonDisabled(context: BalatroEngine) {},
  };
}

export const buffonsPlayer = [
  createBuffon1(),
  createBuffon2(),
  createBuffon3(),
];

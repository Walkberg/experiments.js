import { createCallbackManager, getCallbackManager, Mod } from "./mod";

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

import { v4 as uuid } from "uuid";
import { BalatroEngine } from "../balatro-engine";
import { Consumable, PokerCardPack } from "../plugins";
import { createBaseConsumable } from "./consumables";
import { createRandomPokerCard } from "./poker-cards";

export type PackConfigId = string;

export type PackType = "arcana" | "joker";

export type Position = {
  x: number;
  y: number;
};

export type PackConfig = {
  id: PackConfigId;
  name: string;
  description: string;
  position: Position;
};

const planetConfigs: Record<PackConfigId, PackConfig> = {
  p_arcana: {
    id: "p_arcana",
    name: "Joker",
    description: "Joker",
    position: {
      x: 0,
      y: 3,
    },
  },
  p_joker: {
    id: "p_joker",
    name: "Joker",
    description: "Joker",
    position: {
      x: 1,
      y: 3,
    },
  },
};

export function getPackConfig(configId: PackConfigId): PackConfig {
  return planetConfigs[configId];
}

export function createBasePack({
  name,
  description,
  packType,
  configId,
}: {
  name: string;
  description: string;
  packType: PackType;
  configId: PackConfigId;
}): PokerCardPack {
  const pack = createBasePackee({
    name,
    description,
    type: "pack",
    configId,
  });

  pack.onConsumableUsed = (ctx: BalatroEngine) => {};

  pack.checkCanUse = (ctx: BalatroEngine) => {
    return true;
  };

  pack.getBuyPrice = () => {
    return 3;
  };

  pack.getSellPrice = () => {
    return Math.floor(pack.getBuyPrice() / 2);
  };

  return pack;
}

const createJokerPack = (): PokerCardPack => {
  const pack = createBasePack({
    name: "Joker",
    description: "Joker",
    packType: "joker",
    configId: "p_joker",
  });

  return pack;
};

const createArcanaPack = (): PokerCardPack => {
  const pack = createBasePack({
    name: "Aracana",
    description: "Aracana",
    packType: "arcana",
    configId: "p_arcana",
  });

  return pack;
};

export const packs = [createJokerPack(), createArcanaPack()];

export function createBasePackee({
  name,
  description,
  type,
  configId,
}: {
  name: string;
  description: string;
  type: "pack";
  configId: string;
}): PokerCardPack {
  function getBuyPrice() {
    return 3;
  }

  function getSellPrice() {
    return Math.floor(getBuyPrice() / 2);
  }

  function generateCards(ctx: BalatroEngine) {
    return [
      createRandomPokerCard(),
      createRandomPokerCard(),
      createRandomPokerCard(),
      createRandomPokerCard(),
      createRandomPokerCard(),
    ];
  }

  return {
    id: uuid(),
    name: name,
    type: type,
    description,
    configId,
    getBuyPrice,
    getSellPrice,
    generateCards,
  };
}

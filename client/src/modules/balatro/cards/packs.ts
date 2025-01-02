import { BalatroEngine } from "../balatro-engine";
import { Consumable } from "../plugins";
import { createBaseConsumable } from "./consumables";

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

export function createPackConsumable({
  name,
  description,
  packType,
  configId,
}: {
  name: string;
  description: string;
  packType: PackType;
  configId: PackConfigId;
}): Consumable {
  const pack = createBaseConsumable({
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

const createJokerPack = (): Consumable => {
  const pack = createPackConsumable({
    name: "Joker",
    description: "Joker",
    packType: "joker",
    configId: "p_joker",
  });

  return pack;
};

const createArcanaPack = (): Consumable => {
  const pack = createPackConsumable({
    name: "Aracana",
    description: "Aracana",
    packType: "arcana",
    configId: "p_arcana",
  });

  return pack;
};

export const packs = [createJokerPack(), createArcanaPack()];

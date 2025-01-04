import { v4 as uuid } from "uuid";
import { BalatroEngine } from "../balatro-engine";
import { Buffon } from "../plugins";
import { createRandomPokerCard, PokerCard } from "./poker-cards";
import { PlanetCard, TarotCard } from "../balatro";
import { Buyable } from "../plugins/buffons-manager-plugin";

export type PackConfigId = string;

export type PackType = "arcana" | "buffon";

export type Position = {
  x: number;
  y: number;
};

export type PackConfig = {
  id: PackConfigId;
  name: string;
  description: string;
  position: Position;
  cardCount: number;
};

export type Pack<T> = {
  id: string;
  name: string;
  type: "pack";
  configId: string;
  description: string;
  onConsumableUsed?: (ctx: BalatroEngine) => void;
  generateCards: (ctx: BalatroEngine) => T[];
} & Buyable;

export type PokerCardPack = Pack<PokerCard>;

export type TarotPack = Pack<TarotCard>;

export type PlanetPack = Pack<PlanetCard>;

export type BuffonPack = Pack<Buffon>;

const packConfigs: Record<PackConfigId, PackConfig> = {
  p_arcana: {
    id: "p_arcana",
    name: "Joker",
    description: "Joker",
    cardCount: 1,
    position: {
      x: 0,
      y: 3,
    },
  },
  p_joker: {
    id: "p_joker",
    name: "Joker",
    description: "Joker",
    cardCount: 2,
    position: {
      x: 1,
      y: 3,
    },
  },
};

export function getPackConfig(configId: PackConfigId): PackConfig {
  const config = packConfigs[configId];
  if (!config) {
    throw new Error(`PackConfig not found for id: ${configId}`);
  }
  return config;
}

export function createBasePack({
  packType,
  configId,
}: {
  packType: PackType;
  configId: PackConfigId;
}): PokerCardPack {
  const config = getPackConfig(configId);
  return {
    id: uuid(),
    name: config.name,
    type: "pack",
    configId,
    description: config.description,
    onConsumableUsed: (ctx: BalatroEngine) => {},
    getBuyPrice: () => 3,
    generateCards: (ctx: BalatroEngine) => {
      return Array.from({ length: config.cardCount }, () =>
        createRandomPokerCard()
      );
    },
  };
}

const createJokerPack = (): PokerCardPack => {
  const pack = createBasePack({
    packType: "buffon",
    configId: "p_joker",
  });
  return pack;
};

const createArcanaPack = (): PokerCardPack => {
  const pack = createBasePack({
    packType: "arcana",
    configId: "p_arcana",
  });
  return pack;
};

export const packs = [createJokerPack(), createArcanaPack()];

import { createRandomPokerCard, PokerCard } from "./poker-cards";
import { BalatroEngine } from "../balatro-engine";
import {
  getPlayerManagerPlugin,
  PlayerManagerPlugin,
} from "../plugins/player-manager-plugin";
import { getDeckManagerPlugin, ScoreManagerPlugin } from "../plugins";
import { Buyable, Sellable } from "./cards";

export type BuffonId = string;

export type BuffonRarity = "common" | "uncommon" | "rare" | "legendary";

export type BuffonCard = {
  id: string;
  name: string;
  type: "buffon";
  description: string;
  configId: string;
  rarity: BuffonRarity;
  onCardComputeScore: (ctx: BalatroEngine, card: PokerCard) => void;
  onBuffonEnabled: (ctx: BalatroEngine) => void;
  onBuffonDisabled: (ctx: BalatroEngine) => void;
} & Buyable &
  Sellable;

export type BuffonConfigId = string;

type Position = {
  x: number;
  y: number;
};

export type BuffonConfig = {
  id: BuffonConfigId;
  name: string;
  rarety: BuffonRarity;
  cost: number;
  position: Position;
};

const buffonConfigs: Record<BuffonConfigId, BuffonConfig> = {
  b_buffon1: {
    id: "b_buffon1",
    name: "buffon_1",
    rarety: "common",
    cost: 3,
    position: {
      x: 0,
      y: 0,
    },
  },
  b_buffon2: {
    id: "b_buffon2",
    name: "buffon_2",
    rarety: "common",
    cost: 3,
    position: {
      x: 1,
      y: 0,
    },
  },
  b_buffon3: {
    id: "b_buffon3",
    name: "buffon_3",
    rarety: "common",
    cost: 3,
    position: {
      x: 2,
      y: 0,
    },
  },
  b_buffon4: {
    id: "b_buffon4",
    name: "buffon_4",
    rarety: "common",
    cost: 3,
    position: {
      x: 3,
      y: 0,
    },
  },
};

export function getBuffonConfig(id: BuffonConfigId): BuffonConfig {
  const config = buffonConfigs[id];

  return config;
}

export function createBuffon1(): BuffonCard {
  const buffon = createBaseBuffon({
    configId: "b_buffon1",
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

export function createBuffon2(): BuffonCard {
  const buffon = createBaseBuffon({
    configId: "b_buffon2",
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

export function createBuffon3(): BuffonCard {
  const buffon = createBaseBuffon({
    configId: "b_buffon3",
    name: "buffon_3",
    description: "ajoute une main",
  });

  buffon.onBuffonEnabled = (context: BalatroEngine) => {
    const playerManagerPlugin = getPlayerManagerPlugin(context);
    console.log("buffon 3 enabled");
    playerManagerPlugin.addMaxHandCount(1);
  };

  buffon.onBuffonDisabled = (context: BalatroEngine) => {
    const playerManagerPlugin = getPlayerManagerPlugin(context);
    playerManagerPlugin.removeMaxHandCount(1);
  };

  return buffon;
}

export function createBuffon4(): BuffonCard {
  const buffon = createBaseBuffon({
    configId: "b_buffon4",
    name: "buffon_4",
    description: "ajoute 3 carte random au deck",
  });

  buffon.onBuffonEnabled = (context: BalatroEngine) => {
    const deckPlugin = getDeckManagerPlugin(context);
    const pokerCard = createRandomPokerCard();
    const pokerCard1 = createRandomPokerCard();
    const pokerCard2 = createRandomPokerCard();
    deckPlugin.addCard(pokerCard);
    deckPlugin.addCard(pokerCard1);
    deckPlugin.addCard(pokerCard2);
  };

  buffon.onBuffonDisabled = (context: BalatroEngine) => {};

  return buffon;
}

export function createBaseBuffon({
  name,
  description,
  configId,
}: {
  name: string;
  description: string;
  configId: BuffonConfigId;
}): BuffonCard {
  const config = getBuffonConfig(configId);

  function getBuyPrice() {
    return config.cost;
  }

  function getSellPrice() {
    return Math.floor(getBuyPrice() / 2);
  }

  return {
    id: name,
    configId,
    name: config.name,
    description,
    rarity: config.rarety,
    type: "buffon",
    onCardComputeScore(context: BalatroEngine, card: PokerCard) {},
    onBuffonEnabled(context: BalatroEngine) {},
    onBuffonDisabled(context: BalatroEngine) {},
    getBuyPrice,
    getSellPrice,
  };
}

export const buffonsPlayer = [
  createBuffon1(),
  createBuffon2(),
  createBuffon3(),
  createBuffon4(),
];

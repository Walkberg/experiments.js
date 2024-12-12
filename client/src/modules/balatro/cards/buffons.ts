import { PokerCard } from "./poker-cards";
import { BalatroEngine, PlayerManagerPlugin } from "../balatro-engine";
import { ScoreManagerPlugin } from "../plugins";
import { Buffon } from "../plugins/buffons-manager-plugin";

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

interface BuffonEntity {
  id: BuffonId;
  name: string;
  rarety: Rarety;
  cost: number;
}

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

function getPlayerManagerPlugin(context: BalatroEngine) {
  const manager = context.getPlugin<PlayerManagerPlugin>("player");

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
  const _price = 5;

  function getBuyPrice() {
    return _price;
  }

  function getSellPrice() {
    return Math.floor(_price / 2);
  }

  return {
    id: name,
    name: name,
    description,
    rarity: "common",
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
];

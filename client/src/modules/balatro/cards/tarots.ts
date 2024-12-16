import {
  Consumable,
  getBuffonManagerPlugin,
  getConsumablesPlugin,
  getHandManagerPlugin,
  getPoolManagerPlugin,
} from "../plugins";
import { createBaseConsumable } from "./consumables";
import { getNextCardRank, TarorType } from "../balatro";
import { CardSuit, EnhancementType } from "./poker-cards";
import { BalatroEngine, getEconomyManagerPlugin } from "../balatro-engine";

type TarotConfigId = string;

type Position = {
  x: number;
  y: number;
};

export type TarotConfig = {
  id: TarotConfigId;
  position: Position;
};

const tarotConfigs: Record<TarotConfigId, TarotConfig> = {
  t_the_fool: {
    id: "t_the_fool",
    position: {
      x: 0,
      y: 0,
    },
  },
  t_the_magician: {
    id: "t_the_magician",
    position: {
      x: 1,
      y: 0,
    },
  },
  t_the_high_priestess: {
    id: "t_the_high_priestess",
    position: {
      x: 2,
      y: 0,
    },
  },
  t_the_empress: {
    id: "t_the_empress",
    position: {
      x: 3,
      y: 0,
    },
  },
  t_the_emperor: {
    id: "t_the_emperor",
    position: {
      x: 4,
      y: 0,
    },
  },
  t_the_hierophant: {
    id: "t_the_hierophant",
    position: {
      x: 5,
      y: 0,
    },
  },
  t_the_lovers: {
    id: "t_the_lovers",
    position: {
      x: 6,
      y: 0,
    },
  },
  t_the_chariot: {
    id: "t_the_chariot",
    position: {
      x: 7,
      y: 0,
    },
  },
  t_justice: {
    id: "t_justice",
    position: {
      x: 8,
      y: 0,
    },
  },
  t_the_hermit: {
    id: "t_the_hermit",
    position: {
      x: 9,
      y: 0,
    },
  },
  t_the_wheel_of_fortune: {
    id: "t_the_wheel_of_fortune",
    position: {
      x: 1,
      y: 0,
    },
  },
  t_strength: {
    id: "t_strength",
    position: {
      x: 1,
      y: 1,
    },
  },
  t_the_hanged_man: {
    id: "t_the_hanged_man",
    position: {
      x: 1,
      y: 2,
    },
  },
  t_death: {
    id: "t_death",
    position: {
      x: 1,
      y: 3,
    },
  },
  t_temperance: {
    id: "t_temperance",
    position: {
      x: 1,
      y: 4,
    },
  },
  t_the_devil: {
    id: "t_the_devil",
    position: {
      x: 1,
      y: 5,
    },
  },
  t_the_tower: {
    id: "t_the_tower",
    position: {
      x: 1,
      y: 6,
    },
  },
  t_the_star: {
    id: "t_the_star",
    position: {
      x: 1,
      y: 7,
    },
  },
  t_the_moon: {
    id: "t_the_moon",
    position: {
      x: 1,
      y: 8,
    },
  },
  t_the_sun: {
    id: "t_the_sun",
    position: {
      x: 1,
      y: 9,
    },
  },
  t_judgment: {
    id: "t_judgment",
    position: {
      x: 2,
      y: 0,
    },
  },
  t_the_world: {
    id: "t_the_world",
    position: {
      x: 2,
      y: 1,
    },
  },
};
export function getTarotConfig(configId: TarotConfigId): TarotConfig {
  return tarotConfigs[configId];
}

export function createTarotConsumable({
  name,
  description,
  configId,
}: {
  name: TarorType;
  description: string;
  configId: TarotConfigId;
}): Consumable {
  const tarot = createBaseConsumable({
    name,
    description,
    type: "tarot",
    configId,
  });

  tarot.getBuyPrice = () => {
    return 3;
  };

  tarot.getSellPrice = () => {
    return Math.floor(tarot.getBuyPrice() / 2);
  };

  return tarot;
}

const createTheFool = (): Consumable => {
  const theFool = createTarotConsumable({
    name: "theFool",
    description: "Le Mat",
    configId: "t_the_fool",
  });

  theFool.onConsumableUsed = (ctx: BalatroEngine) => {
    const consumableManager = getConsumablesPlugin(ctx);

    const lastConsumable = consumableManager.getLastConsumableUsed();

    if (lastConsumable == null) {
      return;
    }

    consumableManager.addConsumable(lastConsumable);
  };

  return theFool;
};

const createTheMagician = (): Consumable => {
  return createUpdateEnhancementTarotCard({
    name: "theMagician",
    description: "Le Magicien",
    enhancement: "lucky",
    maxCardCount: 2,
    configId: "t_the_magician",
  });
};

const createTheHighPriestess = (): Consumable => {
  const theHighPriestess = createTarotConsumable({
    name: "theHighPriestess",
    description: "La Papesse",
    configId: "t_the_high_priestess",
  });

  theHighPriestess.onConsumableUsed = (ctx: BalatroEngine) => {
    const poolManager = getPoolManagerPlugin(ctx);
    const consumableManager = getConsumablesPlugin(ctx);

    const consumables = poolManager.getRandomConsumables(2, "planet");

    for (const consumable of consumables) {
      consumableManager.addConsumable(consumable);
    }
  };

  return theHighPriestess;
};
const createTheEmpress = (): Consumable => {
  return createUpdateEnhancementTarotCard({
    name: "theEmpress",
    description: "L'Impératrice",
    enhancement: "mult",
    maxCardCount: 2,
    configId: "t_the_empress",
  });
};

const createTheEmperor = (): Consumable => {
  return createTarotConsumable({
    name: "theEmperor",
    description: "L'Empereur",
    configId: "t_the_emperor",
  });
};

const createTheHierophant = (): Consumable => {
  return createUpdateEnhancementTarotCard({
    name: "theHierophant",
    description: "Le Pape",
    enhancement: "bonus",
    maxCardCount: 2,
    configId: "t_the_hierophant",
  });
};

const createTheLovers = (): Consumable => {
  return createUpdateEnhancementTarotCard({
    name: "theLovers",
    description: "Les Amoureux",
    enhancement: "wildcard",
    maxCardCount: 1,
    configId: "t_the_lovers",
  });
};

const createTheChariot = (): Consumable => {
  return createUpdateEnhancementTarotCard({
    name: "theChariot",
    description: "Le Chariot",
    enhancement: "steel",
    maxCardCount: 1,
    configId: "t_the_chariot",
  });
};

const createJustice = (): Consumable => {
  return createUpdateEnhancementTarotCard({
    name: "justice",
    description: "La Justice",
    enhancement: "glass",
    maxCardCount: 1,
    configId: "t_justice",
  });
};

const createTheHermit = (): Consumable => {
  const tarot = createTarotConsumable({
    name: "theHermit",
    description: "L'Hermite",
    configId: "t_the_hermit",
  });

  tarot.onConsumableUsed = (ctx: BalatroEngine) => {
    const economyManager = getEconomyManagerPlugin(ctx);

    let money = economyManager.getMoney();

    if (money > 20) {
      money = 20;
    }
    economyManager.addMoney(money);
  };

  return tarot;
};

const createTheWheelOfFortune = (): Consumable => {
  return createTarotConsumable({
    name: "wheelOfFortune",
    description: "La Roue de Fortune",
    configId: "t_the_wheel_of_fortune",
  });
};

const createStrength = (): Consumable => {
  const tarot = createTarotConsumable({
    name: "strength",
    description: "La Force",
    configId: "t_strength",
  });

  tarot.onConsumableUsed = (ctx: BalatroEngine) => {
    const handManager = getHandManagerPlugin(ctx);

    handManager.getSelectedCards().forEach((card) => {
      const cardRank = getNextCardRank(card.rank);
      handManager.upgradeCardValue(card.id, cardRank);
    });
  };

  return tarot;
};

const createTheHangedMan = (): Consumable => {
  const tarot = createTarotConsumable({
    name: "theHangedMan",
    description: "Le Pendu",
    configId: "t_the_hanged_man",
  });

  tarot.onConsumableUsed = (ctx: BalatroEngine) => {
    const handManager = getHandManagerPlugin(ctx);

    handManager.getSelectedCards().forEach((card) => {
      handManager.destroy(card.id);
    });
  };

  tarot.checkCanUse = (ctx: BalatroEngine) => {
    const handManager = getHandManagerPlugin(ctx);

    return (
      handManager.getSelectedCards().length > 0 &&
      handManager.getSelectedCards().length < 2
    );
  };

  return tarot;
};

const createDeath = (): Consumable => {
  const tarot = createTarotConsumable({
    name: "death",
    description: "La Mort",
    configId: "t_death",
  });

  tarot.onConsumableUsed = (ctx: BalatroEngine) => {
    const handManager = getHandManagerPlugin(ctx);

    const firstCard = handManager.getSelectedCards()[0];

    const secondCard = handManager.getSelectedCards()[0];

    //@ todo copy firstCrad into second

    handManager.upgradeCardValue(secondCard.id, firstCard.rank);
    handManager.updateCardEnhancement(secondCard.id, firstCard.enhancement);
    handManager.updateCardSuit(secondCard.id, firstCard.suit);
  };

  tarot.checkCanUse = (ctx: BalatroEngine) => {
    const handManager = getHandManagerPlugin(ctx);

    return handManager.getSelectedCards().length === 2;
  };

  return tarot;
};

const createTemperance = (): Consumable => {
  const tarot = createTarotConsumable({
    name: "temperance",
    description: "Tempérance",
    configId: "t_temperance",
  });

  tarot.onConsumableUsed = (ctx: BalatroEngine) => {
    const buffonManager = getBuffonManagerPlugin(ctx);
    const economyManager = getEconomyManagerPlugin(ctx);

    let price = 0;

    buffonManager.getBuffons().forEach((buffon) => {
      price += buffon.getSellPrice();
    });

    economyManager.addMoney(price < 50 ? price : 50);
  };

  return tarot;
};

const createTheDevil = (): Consumable => {
  return createUpdateEnhancementTarotCard({
    name: "theDevil",
    description: "Le Diable",
    enhancement: "gold",
    maxCardCount: 1,
    configId: "t_the_devil",
  });
};

const createTheTower = (): Consumable => {
  return createUpdateEnhancementTarotCard({
    name: "theTower",
    description: "La Maison Dieu",
    enhancement: "stone",
    maxCardCount: 1,
    configId: "t_the_tower",
  });
};

const createTheStar = (): Consumable => {
  return createUpdateSuitTarotCard({
    name: "theStar",
    description: "L'Étoile",
    cardSuit: "diamonds",
    configId: "t_the_star",
  });
};

const createTheMoon = (): Consumable => {
  return createUpdateSuitTarotCard({
    name: "theMoon",
    description: "La Lune",
    cardSuit: "clubs",
    configId: "t_the_moon",
  });
};

const createTheSun = (): Consumable => {
  return createUpdateSuitTarotCard({
    name: "theSun",
    description: "Le Soleil",
    cardSuit: "hearts",
    configId: "t_the_sun",
  });
};

const createJudgment = (): Consumable => {
  const tarot = createTarotConsumable({
    name: "judgment",
    description: "Le Jugement",
    configId: "t_judgment",
  });

  tarot.onConsumableUsed = (ctx: BalatroEngine) => {
    const poolManager = getPoolManagerPlugin(ctx);
    const buffonManagerPlugin = getBuffonManagerPlugin(ctx);

    const buffon = poolManager.getRandomBuffons(1)[0];

    buffonManagerPlugin.addBuffon(buffon);
  };

  tarot.checkCanUse = (ctx: BalatroEngine) => {
    const buffonManagerPlugin = getBuffonManagerPlugin(ctx);

    return (
      buffonManagerPlugin.getBuffons().length + 1 <=
      buffonManagerPlugin.getMaxCount()
    );
  };

  return tarot;
};

const createTheWorld = (): Consumable => {
  return createUpdateSuitTarotCard({
    name: "theWorld",
    description: "Le Monde",
    cardSuit: "spades",
    configId: "t_the_world",
  });
};

function createUpdateSuitTarotCard({
  name,
  description,
  cardSuit,
  configId,
}: {
  name: TarorType;
  description: string;
  cardSuit: CardSuit;
  configId: TarotConfigId;
}): Consumable {
  const tarot = createTarotConsumable({
    name: name,
    description: description,
    configId,
  });

  tarot.onConsumableUsed = (ctx: BalatroEngine) => {
    const handManager = getHandManagerPlugin(ctx);

    handManager.getSelectedCards().forEach((card) => {
      handManager.updateCardSuit(card.id, cardSuit);
    });
  };

  tarot.checkCanUse = (ctx: BalatroEngine) => {
    const handManager = getHandManagerPlugin(ctx);

    return (
      handManager.getSelectedCards().length > 0 &&
      handManager.getSelectedCards().length < 3
    );
  };

  return tarot;
}

function createUpdateEnhancementTarotCard({
  name,
  description,
  enhancement,
  maxCardCount,
  configId,
}: {
  name: TarorType;
  description: string;
  enhancement: EnhancementType;
  maxCardCount: number;
  configId: TarotConfigId;
}): Consumable {
  const tarot = createTarotConsumable({
    name: name,
    description: description,
    configId: configId,
  });

  tarot.onConsumableUsed = (ctx: BalatroEngine) => {
    const handManager = getHandManagerPlugin(ctx);

    handManager.getSelectedCards().forEach((card) => {
      handManager.updateCardEnhancement(card.id, enhancement);
    });
  };

  tarot.checkCanUse = (ctx: BalatroEngine) => {
    const handManager = getHandManagerPlugin(ctx);

    return (
      handManager.getSelectedCards().length > 0 &&
      handManager.getSelectedCards().length < maxCardCount
    );
  };

  return tarot;
}

export const tarotCards = [
  createTheFool(),
  createTheMagician(),
  createTheHighPriestess(),
  createTheEmpress(),
  createTheEmperor(),
  createTheHierophant(),
  createTheLovers(),
  createTheChariot(),
  createJustice(),
  createTheHermit(),
  createTheWheelOfFortune(),
  createStrength(),
  createTheHangedMan(),
  createDeath(),
  createTemperance(),
  createTheDevil(),
  createTheTower(),
  createTheStar(),
  createTheMoon(),
  createTheSun(),
  createJudgment(),
  createTheWorld(),
];

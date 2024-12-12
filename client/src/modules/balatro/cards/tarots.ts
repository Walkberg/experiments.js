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

export function createTarotConsumable({
  name,
  description,
}: {
  name: TarorType;
  description: string;
}): Consumable {
  const tarot = createBaseConsumable({
    name,
    description,
    type: "tarot",
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
  });
};

const createTheHighPriestess = (): Consumable => {
  const theHighPriestess = createTarotConsumable({
    name: "theHighPriestess",
    description: "La Papesse",
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
  });
};

const createTheEmperor = (): Consumable => {
  return createTarotConsumable({
    name: "theEmperor",
    description: "L'Empereur",
  });
};

const createTheHierophant = (): Consumable => {
  return createUpdateEnhancementTarotCard({
    name: "theHierophant",
    description: "Le Pape",
    enhancement: "bonus",
    maxCardCount: 2,
  });
};

const createTheLovers = (): Consumable => {
  return createUpdateEnhancementTarotCard({
    name: "theLovers",
    description: "Les Amoureux",
    enhancement: "wildcard",
    maxCardCount: 1,
  });
};

const createTheChariot = (): Consumable => {
  return createUpdateEnhancementTarotCard({
    name: "theChariot",
    description: "Le Chariot",
    enhancement: "steel",
    maxCardCount: 1,
  });
};

const createJustice = (): Consumable => {
  return createUpdateEnhancementTarotCard({
    name: "justice",
    description: "La Justice",
    enhancement: "glass",
    maxCardCount: 1,
  });
};

const createTheHermit = (): Consumable => {
  const tarot = createTarotConsumable({
    name: "theHermit",
    description: "L'Hermite",
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
  });
};

const createStrength = (): Consumable => {
  const tarot = createTarotConsumable({
    name: "strength",
    description: "La Force",
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
  });
};

const createTheTower = (): Consumable => {
  return createUpdateEnhancementTarotCard({
    name: "theTower",
    description: "La Maison Dieu",
    enhancement: "stone",
    maxCardCount: 1,
  });
};

const createTheStar = (): Consumable => {
  return createUpdateSuitTarotCard({
    name: "theStar",
    description: "L'Étoile",
    cardSuit: "diamonds",
  });
};

const createTheMoon = (): Consumable => {
  return createUpdateSuitTarotCard({
    name: "theMoon",
    description: "La Lune",
    cardSuit: "clubs",
  });
};

const createTheSun = (): Consumable => {
  return createUpdateSuitTarotCard({
    name: "theSun",
    description: "Le Soleil",
    cardSuit: "hearts",
  });
};

const createJudgment = (): Consumable => {
  const tarot = createTarotConsumable({
    name: "judgment",
    description: "Le Jugement",
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
  });
};

function createUpdateSuitTarotCard({
  name,
  description,
  cardSuit,
}: {
  name: TarorType;
  description: string;
  cardSuit: CardSuit;
}): Consumable {
  const tarot = createTarotConsumable({
    name: name,
    description: description,
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
}: {
  name: TarorType;
  description: string;
  enhancement: EnhancementType;
  maxCardCount: number;
}): Consumable {
  const tarot = createTarotConsumable({
    name: name,
    description: description,
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

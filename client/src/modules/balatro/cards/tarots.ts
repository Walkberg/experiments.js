import {
  Consumable,
  getConsumablesPlugin,
  getHandManagerPlugin,
  getPoolManagerPlugin,
} from "../plugins";
import { createBaseConsumable } from "./consumables";
import { CardSuit, TarorType } from "../balatro";
import { BalatroEngine } from "../balatro-engine";

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
  const theMagician = createTarotConsumable({
    name: "theMagician",
    description: "Le Magicien",
  });

  theMagician.onConsumableUsed = (ctx: BalatroEngine) => {
    const handManager = getHandManagerPlugin(ctx);

    // improve cards
  };

  theMagician.checkCanUse = (ctx: BalatroEngine) => {
    const handManager = getHandManagerPlugin(ctx);

    return (
      handManager.getSelectedCards().length < 2 &&
      handManager.getSelectedCards().length > 0
    );
  };

  return theMagician;
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
  const theEmpress = createTarotConsumable({
    name: "theEmpress",
    description: "L'Impératrice",
  });

  return theEmpress;
};

const createTheEmperor = (): Consumable => {
  return createTarotConsumable({
    name: "theEmperor",
    description: "L'Empereur",
  });
};

const createTheHierophant = (): Consumable => {
  return createTarotConsumable({
    name: "theHierophant",
    description: "Le Pape",
  });
};

const createTheLovers = (): Consumable => {
  return createTarotConsumable({
    name: "theLovers",
    description: "Les Amoureux",
  });
};

const createTheChariot = (): Consumable => {
  return createTarotConsumable({
    name: "theChariot",
    description: "Le Chariot",
  });
};

const createJustice = (): Consumable => {
  return createTarotConsumable({
    name: "justice",
    description: "La Justice",
  });
};

const createTheHermit = (): Consumable => {
  return createTarotConsumable({
    name: "theHermit",
    description: "L'Hermite",
  });
};

const createTheWheelOfFortune = (): Consumable => {
  return createTarotConsumable({
    name: "wheelOfFortune",
    description: "La Roue de Fortune",
  });
};

const createStrength = (): Consumable => {
  return createTarotConsumable({
    name: "strength",
    description: "La Force",
  });
};

const createTheHangedMan = (): Consumable => {
  return createTarotConsumable({
    name: "theHangedMan",
    description: "Le Pendu",
  });
};

const createDeath = (): Consumable => {
  return createTarotConsumable({
    name: "death",
    description: "La Mort",
  });
};

const createTemperance = (): Consumable => {
  return createTarotConsumable({
    name: "temperance",
    description: "Tempérance",
  });
};

const createTheDevil = (): Consumable => {
  return createTarotConsumable({
    name: "theDevil",
    description: "Le Diable",
  });
};

const createTheTower = (): Consumable => {
  return createTarotConsumable({
    name: "theTower",
    description: "La Maison Dieu",
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
  return createTarotConsumable({
    name: "judgment",
    description: "Le Jugement",
  });
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
